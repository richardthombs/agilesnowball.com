---
layout: post
title:  "Migrating a large scale traditional ASP.NET & SQL Server web application to Azure"
date:   2014-08-18 16:20:34
categories: azure
hidden: true
---
# Introduction

More than 10 years ago, we created a SaaS web application using the exciting new technologies of C# and ASP.NET
backed by the less exciting but well understood SQL Server.

The application has been very successful and while we've kept the core infrastructure team small, we've enjoyed
considerable user growth.

With the growth came an ever increasting infrastructure "momentum", making it increasingly hard to change direction.
The more clients we added, the more data they produced, and the more timezones we had to operate in without any downtime.
Before we knew it, we were expected to be running 24/7/365, and due to the nature of our business and customer base, not even
Christmas is available for downtime. Crucially, the data for all our clients is stored in a single database, which is now
nearly 500Gb in size, with some tables containing more than 1 billion rows.

# Pros and Cons of the current infrastructure

## Pros

1. Updating database schema to make ready for new software updates is easy.  
1. Easy to execute "global" queries that span all clients.  
1. Backup and recovery is simple - just a single database, rather than 100s.  
1. Easy to add new clients - no databases to create, no backup or maintenance scripts to modify.  

## Cons

1. Single large database means most management operations take a very long time - backups, reindexing, etc.
1. Single point of failure. (Although having multiple databases on the same RAID array probably means that all the
databases will fail at the same time)
1. Lack of flexibility - can't move a client to their own dedicated server in order to improve performance for them or
for others.
1. Hard to delete a client's data - many related tables to delete from, index locking while deletion is in progress etc.
1. Hard to experiment with - 500Mb of data takes forever to move to another server, import into the cloud, etc, etc.

# Other factors
As well as deciding on whether to continue with the current multi-tenant design of the database infrastructure, other
factors are also influencing our decision:

1. Resilience. A decade ago, having a few hours downtime once every few years was understandable. These days the fault
tolerance and fall-over capabilities of SQL Server and SQL Azure make it almost imperative that the new infrastructure
be able to cope with an entire server failing.
1. Cloud v Hosted. We have been with our current hosted provider since the beginning and they have served us extremely
well. However, the flexibility offered by Azure and AWS make it hard to ignore the potential of the cloud.


# Options for the next 5-10 years

## Continue down the same path
We could simply enlarge the database server. Take a day to schedule migration to a server that has 2-3 times the current capacity.

## Move to Azure and continue down the same path
Rather than enlarging our own database server, we could start using Windows Azure VMs.

## Split the database, keep a single SQL Server
There are many options for splitting the database - one per client, one per continent (so downtime is easier to schedule), or by some
other arbitary property. All the options have several things in common:

1. There is no going back. As soon as the databases are split, each database will start their own primary key generation and there
is bound to be overlap. Merging the databases back together would be a massively complex and slow operation, as each row would have
to be "renumbered" as it was imported.
1. The web application will have to be taught how to determine which database it should connect to when servicing a particular client.
In addition, unauthenticated operations (such as logging in), will have to be able to identify which database to connect to without
the benefit of a logged in identity.

## Split the database, move to multiple SQL Servers

## Split the database, move to Azure databases

## Split the database, move to Azure VMs
