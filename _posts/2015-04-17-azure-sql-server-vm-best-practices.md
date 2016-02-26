---
layout: post
title:  "Azure SQL Server VM Best Practices"
date:   2015-04-17 09:33:00
categories: azure
---

While trying to migrate our database server from a dedicated server to a pair
of Azure VMs, we did a lot of research about how to best configure the VMs
and SQL Server.

_Update: All of these concerns have been rendered moot by the truly excellent Azure Premium Local Storage._

### Storage Account configuration
1. 500 IOPS limit per virtual disk.
1. 20,000 IOPS limit per storage account.
1. Connect as many virtual disks to your machine as possible.
1. Do not place more than 40 highly utilised virtual disks in a single storage account.
1. Use locally-redundant storage, not geo-replicated storage.
1. Disable read and write caching

### Virtual Machine configuration
1. Use a 'D' series machine to take advantage of their faster CPUs, higher levels of memory and their local SSDs.

### Windows Server configuration
1. Stripe all the virtual disks together using Storage Spaces.
1. Number of columns in the stripe should equal the number of virtual discs.
1. Interleave should be 65536 (64KB).
1. Partition should be formatted with a 65536 (64KB) cluster size.
1. Enable instant file initialisation for the SQL Server user.

### SQL Server configuration
1. Use SQL Server 2014's [Buffer Pool Extensions](http://weblogs.asp.net/scottgu/new-d-series-of-azure-vms-with-60-faster-cpus-more-memory-and-local-ssd-disks) to take advantage of the higher speed local D: drive.
1. Enable database page compression.
1. Enable locked pages.
1. Move system databases to data disk.


## Digest of Microsoft best practice posts
1. [Configuring Azure Virtual Machines for Optimal Storage Performance (September 2014)](http://blogs.msdn.com/b/mast/archive/2014/10/14/configuring-azure-virtual-machines-for-optimal-storage-performance.aspx)
  * 500 IOPS per disk
  * 20,000 IOPS per storage account
  * 40 VHDs per storage account
  * Locally redundant storage
  * Attach maximum number of data discs for the machine size
  * Data disks should be the maximum size available (1Tb)
  * Use the "simple" storage spaces configuration
  * Number of columns must equal the number of attached discs
  * Interleave should be set to 65536 (64KB)
  * Partition should be formatted with a 64Kb cluster size
1. [New D-Series of Azure VMs with 60% Faster CPUs, More Memory and Local SSD Disks (September 2014)](http://weblogs.asp.net/scottgu/new-d-series-of-azure-vms-with-60-faster-cpus-more-memory-and-local-ssd-disks)
  * Use 'D' series machines
  * Enable Buffer Pool Extensions
1. [Performance Best Practices for SQL Server in Azure Virtual Machines (February 2015)](https://msdn.microsoft.com/en-us/library/azure/dn133149.aspx)
  * Use minimum Standard Tier A2 for SQL Server VMs.
  * Keep the storage account and SQL Server VM in the same region.
  * Disable Azure geo-replication on the storage account.
  * Avoid using operating system or temporary disks for database storage or logging.
  * Avoid using Azure data disk caching options (caching policy = None).
  * Stripe multiple Azure data disks to get increased IO throughput.
  * Format with documented allocation sizes.
  * Separate data and log file I/O paths to obtain dedicated IOPs for data and log.
  * Enable database page compression.
  * Enable instant file initialization for data files.
  * Limit or disable autogrow on the database.
  * Disable autoshrink on the database.
  * Move all databases to data disks, including system databases.
  * Move SQL Server error log and trace file directories to data disks.
  * Apply SQL Server performance fixes.
  * Setup default locations.
  * Enable locked pages.
  * Backup directly to blob storage.
