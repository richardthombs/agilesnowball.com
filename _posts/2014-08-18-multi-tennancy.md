---
layout: post
title:  "Implementing multi-tennancy"
date:   2014-08-18 22:16:00
hidden: true
---

# Introduction
Almost every web application will have multiple tennants (clients). The immediate problem
faced when designing a system to support multi-tennancy is separation of data. How can you
be certain that client X will not see client Y's data?

At the top level there are two main options:

1. Keep every clients' data in the same database.
2. Keep the data segregated, or keep each client's data in their own private database.

We went with option 1, which we concluded would give us the quickest way
forwards with the least amount of ongoing maintenance.

In hindsight however, this came with some unanticipated consequences:

1. As we became more successful, the database was in demand practically 24/7,
making it hard to perform any kind of maintenance that required exclusive
access to tables or indexes.

1. We had not anticipated the impact of high-volume clients. Once we picked up an
Indian client who quickly accounted for more than half the data in the database, we
realised that our indexing strategy did not take into account the necessity to filter
by client.

1. Deleting the data of ex-clients was challenging as the table structure
did not lend itself to the fast identification of all records owned by a particular
client, meaning that complex joins had to be carried out as part of the DELETE
statement, locking tables for longer than was acceptable.

# Learnings

Our application has an extremely high rows to client ratio, we have more than a billion
records in our busiest table, and several others are in the high hundreds of thousands.
However, we only have about 200 active clients. For applications where the ratio of rows
to clients is smaller, some of the options discussed here will not be applicable.
