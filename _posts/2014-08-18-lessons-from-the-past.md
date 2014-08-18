---
layout: post
title:  "Database design lessons"
date:   2014-08-18 19:15:22
categories: aspnet sqlserver
---

# Introduction
We have a successful web application, designed and architected back in the early days of C# and ASP.NET.
Although the software architecture has been easy to evolve, the supporting database infrastructure has proven
very resilient to change.

This post discusses the design lessons that we have learnt in 10 years of maintaining and upgrading our
database architecture.

# 1. Identify the tenant in every table

While it is ultimately possible to identify the owner of each row in each table, most of the time this is only possible by
joining to one or more related tables. This makes it extremely expensive to delete data owned by ex-clients.

In our example, each client has a unique `AccountID`, and so every table in the database should contain an `AccountID` column.
It does not have to be part of the table's primary key, nor even defined as a foreign key, but create an index on it so that
it's easy to identify rows to delete.

This has the added advantage of making the database easy to [partition](http://msdn.microsoft.com/en-us/library/ms190787.aspx),
should the evolution of the database architecture require it.

