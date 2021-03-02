---
title:       "From simple to full recovery model in SQL Server"
description: "Have you got a highly utilised SQL Server database that you're backing up with the simple recovery model, and now you are wondering how to move to the full recovery model? Well this post is for you!"
date:        2014-08-20 13:42:00
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

```sql
-- Weekly backup
backup database [Test] to disk='C:\Test.bak' with init
backup log [Test] to disk='C:\Test.trn' with init

-- Daily backup
backup database [Test] to disk='C:\Test.dif' with init,differential
backup log [Test] to disk='C:\Test.trn' with init

-- 15 minute backup
backup log [Test] to disk='C:\Test.trn'
```

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

Firstly the full and differential backups should be restored, leaving the
database unrecovered so that you can then restore the log backups:

```sql
-- Restore the full and differential backups
restore database [Test] from disk='C:\Test.bak' with norecovery
restore database [Test] from disk='C:\Test.dif' with norecovery
```

The backup script above ensures that all the transaction log backups are in
the same file, and that it only contains backups that come after the last
full / differential backup. This makes it easy to identify which transaction
log backups to restore - you need to restore all of them!

To see how many transaction log backups there are:

```sql
-- See how many files are in the transaction log backup
restore headeronly from disk='C:\Test.trn'
```

Then restore each transaction log backup. Each `restore database` command
restores an individual transaction log backup. You have to issue one command
for each transaction log backup:

```sql
-- Restore each transaction log backup in turn
restore database [Test] from disk='C:\Test.trn' file=1 with norecovery
restore database [Test] from disk='C:\Test.trn' file=2 with norecovery
-- (Repeat for each backup in the set, note the incrementing file value)
```

Then finally the database can be recovered and brought back online:

```sql
-- Bring the database back online
restore database [Test] with recovery
```

# Switching recovery models

Switching between recovery models is easy, and it can be done on a large, in-use
database in a matter of moments.

```sql
-- Configure database to use the full recovery model
alter database [Test] set recovery full
```

However, until another full backup is performed, the database will remain in _pseudo
simple recovery mode_, where the transaction log is truncated whenever a
database checkpint occurs. As soon as the first full backup is completed, the
expected behaviour of full recovery mode begins.

```sql
-- Full database backup
backup database [Test] to disk='C:\Test.bak'
```

_See [The Accidental DBA](http://www.sqlskills.com/blogs/paul/the-accidental-dba-day-30-of-30-troubleshooting-transaction-log-growth)
for more details._

# How big will my log files grow?
Provided that you are performing regular full, differential AND log backups,
then transaction logs will grow no larger than in simple recovery mode. In fact,
because you will probably be performing log backups with a far higher frequency
than you were previously performing differential backups, then the transaction
log might actually end up being smaller (although you will have to shrink the
log file to find out for sure).

# How long will the first log backup take?

You should have performed a full backup as soon as you switched over to
full recovery, so the after that backup has completed, the first log backup
will be relatively fast.

# Scheduling database backups vs transaction log backups

According to [this question](https://dba.stackexchange.com/questions/4347/should-i-stop-transaction-log-backups-during-a-full-backup?newreg=e43f8aa2e1814058bde408db1eda3a1d) on StackExchange, it is perfectly possible to have
database backups and transaction log backups running at the same time, so it is
not necessary to make any effort stopping one running when the other is active.

It also doesn't matter if you accidentally schedule a full backup and a
differential database backup to run at the same time - the differential will
block until the full backup has completed and then execute. The completed
differential backup will use the full backup that just finished as it's
baseline too.
