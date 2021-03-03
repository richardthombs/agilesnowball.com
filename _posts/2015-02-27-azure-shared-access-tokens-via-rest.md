---
layout: post
title:  "How to use Azure Storage Queues and Shared Access Signatures via the REST API"
description: "Azure's Shared Access Signatures make it easy to give limited access to a Storage Queue to a third party without having to share your account keys."
date:   2015-02-27 09:26:00
---

Azure's [Shared Access Signatures](https://msdn.microsoft.com/en-us/library/azure/ee395415.aspx)
make it easy to give limited access to a Storage Queue to a third party without
having to share your account keys.

First, here is some simple C# code that creates an Azure Storage Queue
and creates a Shared Access Signature with Read and ProcessMessages permissions.

```cs
string queueName = "myqueue";
string storageAccount = "UseDevelopmentStorage=true";

// Create the storage queue
var account = CloudStorageAccount.Parse(storageAccount);
var client = account.CreateCloudQueueClient();
var queue = client.GetQueueReference(queueName);
queue.CreateIfNotExists();

// Define an access policy
var policy = new SharedAccessQueuePolicy
{
  Permissions = SharedAccessQueuePermissions.ProcessMessages |
                SharedAccessQueuePermissions.Read,
  SharedAccessExpiryTime = DateTimeOffset.UtcNow.AddDays(1)
};

// Get a shared access signature for the queue that enforces the policy
var sas = queue.GetSharedAccessSignature(policy);

Console.WriteLine(sas);
```

The resulting Shared Access Signature is actually a URL Query String fragment:

```
?sv=2014-02-14&sig=8CtFprtQUJyGZls%2FiqHiEyp2390IdXZc3zC7QSb7bDU%3D&se=2015-02-28T09%3A39%3A13Z&sp=rp
```

We can incorporate this signature into requests that we make via the Azure REST
API which manipulate the queue. For example, to peek at the next message in the
queue:

```sh
curl http://127.0.0.1:10001/devstoreaccount1/myqueue/messages \
  ?sv=2014-02-14 \
  &sig=8CtFprtQUJyGZls%2FiqHiEyp2390IdXZc3zC7QSb7bDU%3D \
  &se=2015-02-28T09%3A39%3A13Z \
  &sp=rp \
  &peekonly=true
```

That's a big URL, but most of it is the address of the Azure server, the path to
the queue and the Shared Access Signature itself.

In order to find the host and path required to connect to the queue, you can
use the CloudQueue's `StorageUri` property:

```cs
var queueUri = queue.StorageUri.PrimaryUri;
Console.WriteLine(queueUri);
```

On a development machine, this will return something like:

```
http://127.0.0.1:10001/devstoreaccount1/myqueue
```

This is then composed along with whatever additional URL and Query String
fragments the [Azure REST API](https://msdn.microsoft.com/library/azure/dd179363.aspx) specifies, so for the example above, that was
`/messages` in the URL and `&peekonly=true` for the Query String.
