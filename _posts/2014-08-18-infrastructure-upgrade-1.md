---
layout: post
title:  "Upgrading ASP.NET database infrastructure"
date:   2014-08-18 19:15:22
categories: aspnet sqlserver azure
---

# Introduction
We have a successful web application, designed and architected back in the early days of C# and ASP.NET.
Although the software architecture has been easy to evolve, the supporting database infrastructure has proven
very resilient to change.

The database design is a single, monolithic, multi-tenant database, hosted on a powerful database server with
the database stored on a large RAID 10 volume.

While the design has been extremely successful and cost-effective, it is not without it's problems.

1. The database server itself represents a huge single point of failure. Although backups of database and transaction
logs would ensure no data was lost, the amount of downtime required to restore the backups onto a new server would
be embarrasing and the loss of client confidence would be damaging to the business.

1. The database is in use 24/7/365, making it hard to perform any maintainance that requires downtime.

1. The database is too large to quickly replicate, making experiementation on database copies impossible.

1. The database backups are too large to efficiently download.

1. Re-indexing and other database maintenance operations take too long and lock essential tables.

1. Pruning out old client's data is slow, requiring many joins and lengthy operations that lock essential tables.

# Options

## Database servers
1. Single SQL Server
1. Fault tolerant SQL Server pair
1. SQL Azure

## Cloud v Hosted
1. Disc performance

## Tennancy
1. Single tenant per database
1. Multiple tenants per database
