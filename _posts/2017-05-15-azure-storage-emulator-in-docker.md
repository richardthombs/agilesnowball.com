---
layout: post
title:  "Azure Storage Emulator in Docker"
date:   2017-05-15 09:33:00
---

This post explains how to containerise the Azure Storage Emulator and how to reconfigure your .NET application to access it. This can be extremely useful when deploying a containerised application for testing and/or demonstration purposes.

## Overview

The basic steps necessary to get the emulator working are:

1. Install SQL Server 2012 LocalDB.
2. Create a database for the emulator to use.
3. Install the Azure Storage Emulator.
4. Configure the emulator to use the database we created for it.
5. Configure the emulator to listen on the correct IP address.
6. Launch the emulator.

## Initial preparation

1. Create a new folder for your Docker container
1. The Azure Storage Emulator requires SQL Server 2012 LocalDB. Unfortunately there is no direct download link for this MSI, instead you have to go to the [SQL Server 2012 download page](https://www.microsoft.com/en-us/download/details.aspx?id=50003), click on the "Download" button, check the  "ENU\x64\SqlLocalDB.msi" checkbox and then click on the "Next" button. Save the MSI into the folder you just created and make sure you save it as `SqlLocalDB.msi`.

```powershell
mkdir azure-storage-emulator
cd azure-storage-emulator
 ```

## Build the container image

Use the following as the basis for your `dockerfile`:

```text
# escape=`

FROM microsoft/windowsservercore

# SQL Server 2012 LocalDB
COPY SqlLocalDB.msi .
RUN Start-Process -FilePath msiexec -ArgumentList /q, /i, SqlLocalDB.msi, IACCEPTSQLLOCALDBLICENSETERMS=YES -Wait;
RUN "& 'C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SqlLocalDB.exe' create azure -s"

# Azure Storage Emulator
ADD  https://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409 MicrosoftAzureStorageEmulator.msi
RUN Start-Process -FilePath msiexec -ArgumentList /q, /i, MicrosoftAzureStorageEmulator.msi -Wait;
RUN "& 'C:\Program Files (x86)\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator.exe' init /server '(localdb)\azure'"
EXPOSE 10000 10001 10002

# Configure and launch
COPY start.ps1 .
CMD .\start
```

The `start.ps1` Powershell script is responsible for reconfiguring the emulator and launching it. It contains one little bit of magic to rewrite the default config file so that the emulator listens on the container's IP address, as by default it will only listen on 127.0.0.1, which is useless when it's isolated inside its own container:

```powershell
# Find our external IP address
$ip = (get-netipaddress | where {$_.AddressFamily -eq "IPv4" -and $_.AddressState -eq "Preferred" -and $_.PrefixOrigin -ne "WellKnown" }[0]).IPAddress

# Rewrite AzureStorageEmulator.exe.config to use it
$config = "C:\Program Files (x86)\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator.exe.config"
(get-content $config) -replace "127.0.0.1",$ip | out-file $config

# Launch the emulator
& "C:\Program Files (x86)\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator.exe" start -inprocess
```

Build the container image:

```sh
docker build -t azure-storage-emulator .
```

and then run it:

```sh
docker run --rm --name storage azure-storage-emulator
```

## How to access it from another container

Modify your application's config file by replacing `"UseDevelopmentStorage=true"` with the following, taking care to replace `storage` with whatever name you gave your container.

`"DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://storage:10000/devstoreaccount1;TableEndpoint=http://storage:10002/devstoreaccount1;QueueEndpoint=http://storage:10001/devstoreaccount1"`

As [documented here](https://docs.microsoft.com/en-us/azure/storage/storage-use-emulator#connect-to-the-emulator-account-using-the-well-known-account-name-and-key), the `UseDevelopmentStorage` option is just shorthand for a full connection string that points to `127.0.0.1`.
