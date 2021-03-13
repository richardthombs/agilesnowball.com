---
layout: post
title:  "Migrating a large scale traditional ASP.NET & SQL Server web application to Kubernetes (Part 1)"
date:   2021-01-10 16:20:34
---

# Background
My client has a large ASP.NET application running on a pair of Azure VMs. The web server is a 32 core, 128Gb VM and the database server is SQL Server running on an 8 core, 32Gb VM.

The site is busy during business hours with a significant peak during lunchtime. The rest of the time the site sees considerably less traffic.

Recently the CPU utilisation of the web server has been hitting 90-95% during the peak period which in turn has had a noticeable impact on response times.

While they could (again) scale vertically and move to a 64 core machine, the amount of CPU time wasted during the site's quiet periods makes this a very cost-inefficient way of solving the problem.


# Analysis
The web server serves two application domains, an MVC / Web API and an old-school WebForms application. Monitoring the loads of these domains individually shows that during peak load, 90% of usage is from the Web API.

Monitoring the usage of each API, including response times and calls per second did not uncover any particularly inefficient method causing bottlenecks, leading to the conclusion that it was simply the total quantity of requests that was causing the load.


# Solution
I proposed replacing the monolithic web server with a Kubernetes cluster which will allow the website to scale in proportion to usage.

Not only will this allow the website to scale to meet peak load but during idle periods the cluster can scale down to a far smaller core count than the current 32 core server, offering the opportunity to save money as well as improve performance during busy periods.

The SQL Server will remain as a classic VM with a possible further project to migrate the database to Azure SQL.


# Opportunities
As part of the required refactoring, I identified some other low-hanging opportunities that could be implemented at the same time:

1. The MVC / Web API part of the website can be ported to .NET 5 so that it can be hosted on Linux, saving Windows license fees.
1. The worker processes can also be ported to .NET 5 so that they can run onLinux, saving Windows license fees and reducing load on the database server (where they currently run).
1. The worker processes are currently implemented as single-instance, multi-threaded applications. They can be refactored to be multi-instance, single-threaded which will simplify their implementation.


# Architecture
The solution will be hosted on an Azure Kubernetes cluster comprised of both Linux and Windows nodes.

Multiple instances of the traditional ASP.NET WebForms part of the website will be hosted on the Windows nodes, while all other tasks will be hosted on Linux nodes.

The separately hosted components of the website will be stitched into a whole by using an NGINX proxy layer comprising of three locations:

`/` - The MVC company website and host of the static AngularJS client frontend.  
`/api` - The ASP.NET Web API.  
`/cdsweb` - The ASP.NET WebForms application.  


# Steps required
1. Refactor the website to remove dependence on session state.
1. Investigate how to connect an Azure Kubernetes resource to an (obsolete) "Classic" VM.
1. Investigate how to ensure a worker process terminates cleanly when its hosting container is terminated.
1. Port the MVC / Web API website to .NET 5 so that it can be hosted on Linux.
1. Port the worker processes to .NET 5 so that they can be hosted on Linux and refactor them to run as single-threaded applications.
1. Create a new build process which produces containerised versions of the MVC / WebAPI / WebForms parts of the website and the worker processes.
1. Create and containerise a reverse proxy layer which routes to the MVC / Web API / WebForms containers as appropriate.
1. Create a new deployment process


# Conclusion
Hopefully this has highlighted some of the considerations and opportunities that arise when porting a web application to Kubernetes.

Future posts will consider each of the implementation steps in turn and how they worked out.
