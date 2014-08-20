---
layout: post
title:  "From simple to full recovery model in SQL Server"
date:   2014-08-20 13:42:00
categories: sqlserver
---

Have you got a highly utilised SQL Server database that you're backing up with
the simple recovery model, and now you are wondering how to move to the full
recovery model? Well this post is for you!

# Simple vs Full
In a nutshell, the difference between SQL Server's simple and full recovery
models is whether or not the transaction log file is part of your backup
strategy.

In simple mode, the transaction log is ignored, so you can only restore to your
most recent full or differential database backup.

In full mode, you can restore to your most recent full / differential backup and
then continue to restore log backups that will roll your database further and
further forwards until (hopefully) right up to the moment of failure.

# Transaction log backups
Unlike a differential database backup, a transaction log backup only records the
changes that have been made to the database since the last transaction log
backup, rather than containing all the changes since the last full backup. This
has two important consequences:

1. They are quick to make and (typically) quite small.
2. You need an unbroken chain of all the transaction log backups that lead from
the most recent full or differential backup all the way forwards in time to the
point of recovery... ALL of them, not just the most recent one.

Both of these points are very important. Firstly, because of the speed, it's
completely possible to schedule transaction log backups to occur every few
minutes, which means you can dramatically reduce your potential data loss in the
event of a disaster.

Secondly, you have to keep track of many more backup files. Imagine if you are
doing a differential backup once a day and transaction log backups every 15
minutes. That's potentially 24*4 = 96 transaction log backups to keep track of
and restore.

# A simple example

{% highlight sql %}
-- Weekly backup
backup database [Test] to disk='C:\Test.bak' with init
backup log [Test] to disk='C:\Test.trn' with init

-- Daily backup
backup database [Test] to disk='C:\Test.dif' with init,differential
backup log [Test] to disk='C:\Test.trn' with init

-- 15 minute backup
backup log [Test] to disk='C:\Test.trn'
{% endhighlight %}

Here we see three simple sets of commands to perform weekly, daily and
quarter-hourly backup.

At any given moment, the server will have 3 backup files: `Test.bak`, `Test.dif`
and `Test.trn`. Notice that the weekly and daily backup includes a log backup
that reinitialises `Test.trn`. This ensures that we only keep those transaction
logs that are needed.

The 15 minute backup of the transaction log appends new backup sets to the end
of `Test.trn`, so that there is only ever a single backup file containing all
of the transaction logs you need to restore.

# Restoring the database

If you are using the above scripts, then you will have three backup files to
restore.

{% highlight sql %}

-- Restore the full and differential backups
restore database [Test] from disk='C:\Test.bak' with norecovery
restore database [Test] from disk='C:\Test.dif' with norecovery

-- See how many files are in the transaction log backup
restore headeronly from disk='C:\Test.trn'

-- Restore each transaction log backup in turn
restore database [Test] from disk='C:\Test.trn' file=1 with norecovery
restore database [Test] from disk='C:\Test.trn' file=2 with norecovery
-- (Repeat for each backup in the set, note the incrementing file value)

-- Bring the database back online
restore database [Test] with recovery

{% endhighlight %}
