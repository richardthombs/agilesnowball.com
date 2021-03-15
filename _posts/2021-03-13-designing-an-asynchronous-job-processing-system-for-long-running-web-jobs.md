---
title: Designing an asynchronous job processing system for long-running web jobs
description: Often a website has to process a bulk task that will take too long to run synchronously. This describes one possible architecture for an asynchronous solution using a message queue.
date: 2021-03-13 09:00:00
---

Often a website will need to perform a long running task such as importing or exporting a large file or triggering some other long-running process. Attempting to handle such tasks in a synchronous fashion will cause the initial web request to stall while the backend performs the processing and eventually returns, allowing the website to return a 200 response. If the processing time is only a few seconds this might be acceptable, but for long running tasks this is not a satisfactory user experience. In the worst situations, the web browser or the web server will simply give up waiting for the backend to produce the results and the user will receive a "timeout" error.

To resolve this problem it is necessary to move to an asynchronous method of processing the request. This blog post looks at one method for implementing such a method.


# The UX goal
We want the user to receive constant feedback as to the state of the job. This will allow them to follow the job's progress, making a long task seem to take less time than if they were simply staring at a spinner.

To that end, we will have 3 message types:
1. "Waiting for job to start..."
1. "Job running, 1% complete..."
1. "Job complete"


# Web API design
The Web API will consist of two endpoints:

## /api/uploads
The frontend will use this to upload a file for subsequent processing.

### `POST /api/uploads`

The response will contain a Guid, which can be used to identity the file when submitting the job via the jobs API:

## /api/jobs
This allows the frontend to create a new processing job and to check on the progress of an existing job.

### `POST /api/jobs`
The request body will define the type of job to be launched as well as which file to use:

```typescript
{
	jobType: "import" | "export",
	fileGuid?: string
}
```

The response will contain a Guid which can be used to identify the job.

### `GET /api/jobs/:guid`

Which will return the current state of the job:

```typescript
{
  status: "waiting" | "running" | "completed",
  itemCount: number,
  itemProgress: number
}
```

`itemCount` is an indication of how many items the job was broken into. For processing a spreadsheet import this would typically be the number of rows in the spreadsheet.

`itemProgress` indicates how many items have already been processed.


# Backend design
The file upload service will be defined by the following interface:

```cs
public interface IFileUploadService
{
  Guid Upload(byte[] contents)
  byte[] Get(Guid fileGuid);
}
```

The job service will be defined as follows:

```cs
public interface IBackgroundJobService
{
  Guid Create(JobDefinition job);
  JobState Get(Guid jobGuid);
  void SetCount(Guid jobGuid, int itemCount);
  void JobProgress(Guid jobGuid, int itemProgress);
  void JobCompleted(Guid jobGuid);
}

public class JobDefinition
{
  public JobType JobType { get; set; };
  public Guid FileGuid { get; set; };
}

public class JobState
{
  public Guid JobGuid { get; set; }
  public JobStatus JobStatus { get; set; }
  public int ItemCount { get; set; }
  public int ItemProgress { get; set; }
}

public enum JobType
{
  Import,
  Export
}

public enum JobStatus
{
  Waiting,
  Running,
  Completed
}
```

The `IBackgroundJobService` provides methods to create a new job and to retrieve & update its state.


# Implementation choices

## The message queue
Although we already know that we're going to use a message queue to disconnect job submission from the task of actually processing the job, it is worth discussing why
this is a good idea.

Firstly, we don't want to use any of the web site's CPUs to perform the processing because that will take up CPU capacity that is best spent on servicing HTTP requests. Using a queue as an intermediary allows the processing to be moved to an entirely different (cluster) of CPUs and these could be potentially scaled up and down in response to queue length without affecting the load or scaling of the web servers.

Secondly, a queue is great for sharing a task out amongst multiple workers without putting undue influence on the design of those workers. Queues can be consumed just as easily by a multi-threaded single-instance workers or a single-threaded, multi-instance workers.

The implementation will involve breaking the job into multiple messages and placing them into a message queue. One or more queue workers will retrieve messages from the queue, perform the required processing and update the job's progress accordingly.

The message queue / queue worker pattern allows the queue to be processed in parallel by simply instantiating more queue workers.

The `Create job` message will contain a `JobDefinition` instance. Upon receipt, the queue worker will load the specified file and create a `Process item` message for each line in the file. Each `Process item` message will contain the content of the line as well as the line number. Finally the worker will create a `Job completed` message which will be used to mark the job as completed.

The implementation of the message queue will not be discussed in this blog post, but the interface will look like this:

```cs
public interface IMessageSource<T>
{
  void Send(T message);
}

public interface IMessageSink<T>
{
  T Receive();
  void Delete(T message)
}
```

This is a pretty standard implementation for a queue. `IMessageSource` provides an interface for adding messages to the queue and `IMessageSink` provides methods for pulling the next message from the queue and permanently removing a message from the queue, with the idea being that if `Delete` isn't called then the queue assumes that processing fails and will either re-queue it or move it into a dead-letter queue instead.

Our messages will all share a common marker interface so that they can be strongly typed to match the queue interfaces.

```cs
public interface IBackgroundJobMessage
{
  Guid JobGuid { get; set; }
}

public class CreateJobMessage : IBackgroundJobMessage
{
  public Guid JobGuid { get; set; }
  public JobDefinition JobDefinition { get; set; }
}

public class ProcessItemMessage : IBackgroundJobMessage
{
  public Guid JobGuid { get; set; }
  public string Content { get; set; }
}

public class JobCompletedMessage : IBackgroundJobMessage
{
  public Guid JobGuid { get; set; }
}

```

A dispatcher will be responsible for pulling messages from the queue, invoking the correct handler based on the message's type and then either deleting the message if the handler completes, or moving the message into a dead letter queue if it throws an exception.

There are a lot of great technology choices for queues. For our purposes we should choose one that is:
- Persistent
- Guarantees delivery _at least_ once
- Guarantees delivery order

Another factor will be message size. This entire concept rests on the fact that each `Process item` message contains the data from one row of the spreadsheet to import. If the
maximum message size of our queue is smaller than the maximum possible size of a row of the spreadsheet then this solution will require re-architecting.

## Persisting job state
As well as persisting the contents of the message queue, we will also need to ensure that
the state of each job is persisted for as long as it is needed.

There are several factors influencing our choices here:
- Are the workers implemented as threads in the same process?
- Are the workers all running on the same (virtual) machine?
- Are the workers separate processes on separate (virtual) machines?

These days the likely implementation of a queue worker would be a containerised process, probably hosted in a Kubernetes pod or perhaps as a serverless cloud function. In other words, separate processes on separate VMs.

To support such a worker implementation, we will need a separate networked service which can be accessed by these workers. A MongoDB-style document database or a persisted Redis cache would suffice.

### Updating job state
A second consideration is concurrency. Because multiple queue workers might attempt to update progress on an active job at the same time, we will need an implementation that can handle concurrent updates. In particular we need to be sure that when the implementation needs to add progress, that we are able to query the current state and then update it within a single atomic operation.

Both Mongo and Redis support these kinds of operation with `$inc` for Mongo and `INCR` for Redis, so both still seem good candidates.

### Should the job state persistence layer be abstract?
It seems like the job state persistence layer might a good candidate for abstracting into
an interface so that we could have Mongo and Redis implementations. However on closer inspection, such an interface would very closely follow the existing `IBackgroundJobService`, which itself won't require too much code to implement. So for now we will not create a further layer of abstraction and instead create MongoDB and Redis implementations of `IBackgroundJobService`.

# Implementation
Before creating classes which implement these interfaces, lets summarise what those classes will be and what is expected of them:

## MongoBackgroundJobService
This is an implementation of the `IBackgroundJobService` using MongoDB as a persistent
store of job state.

```cs
public Guid Create(JobDefinition job);
```
1. Create a new Guid and use it as the job's Guid.
1. Create a document in the database associated with this job's Guid. The document
must represent the job in the "Waiting" status, with zero items and zero progress.
1. Return the job's Guid.

```cs
public JobState Get(Guid jobGuid);
```
1. Retrieve the document associated with the supplied job Guid.
2. Return `null` if document does not exist.
3. Return a `JobState` instance created from the document.

```cs
public void SetCount(Guid jobGuid, int itemCount);
```
1. Update the `itemCount` of the document associated with the supplied job Guid.
1. If the document does not exist, do nothing.

```cs
public void JobProgress(Guid jobGuid, int itemProgress);
```
1. Increment the ItemProgress field of the document associated with the given job Guid.
1. Set the status to "Running" if it is currently "Waiting".
1. If the document does not exist, do nothing.

```cs
public void JobCompleted(Guid jobGuid);
```
1. Update the status of the document to "Completed".

## Message handlers
The message handlers do not have to comply with any particular interface which we have defined, but they will probably have to comply with the requirements of the message dispatcher - maybe following a naming convention for automatic registration or some other way of allowing them to be identified and called correctly.

### CreateJobMessageHandler
This is a handler to be invoked by the queue's message dispatcher when it receives a `Create job` message. It must:
1. Retrieve the file to be imported using the `IFileUploadService`.
1. Use `IBackgroundService.SetItemCount` to set the item count for the job.
1. For each line of the file it must send a `Process item` message, setting the `Content` property to the contents of that line.
1. Send a `Job completed` message.

> Note: This is why we want the message queue to guarantee message ordering - we don't really want the `Job completed` message to be processed before the last `Process item` message, although just how serious that would be depends a lot on the specific use case.

### ProcessItemMessageHandler
This is a handler to be invoked by the message dispatcher when it receives a `Process item` message. It must:
1. Retrieve the line to process from the message's `Content` property.
1. Process the line appropriately.
1. Use `IBackgroundService.JobProgress` to indicate that a  

### JobCompletedMessageHandler
This is a handler to be invoked by the message dispatcher when it receives a `Job completed` message.


# Conclusion
This has shown how to design a simple asynchronous file-processing system, how to make it independent from implementation choices and discussed some of reasons behind the architectural and the technology choices made along the way.

The complete implementation will be made available on my [GitHub](https://github.com/richardthombs) shorty.
