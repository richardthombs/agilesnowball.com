---
title: Founding TeamHaven
description: A retrospective on founding my field management solution, TeamHaven
date: 2026-02-19 09:07:00
---

I co-founded TeamHaven with two business partners after recognising a clear opportunity to build an operating system tailored for field marketing companies — a platform designed to streamline operations, improve visibility, and support scalable growth.

At the time, most field marketing organisations were small SMEs, typically employing 10–30 core full-time staff supported by a large, distributed workforce of part-time field workers.

Although each company operated within its own competitive niche, their core operational needs were the same: Tracking and managing field workers, scheduling who would visit which retail locations and capturing structured information about what occurred during those visits.

This was the early 2000s: C# had only just been introduced, smartphones did not yet exist, and Microsoft’s Windows Mobile platform was the primary option for supporting mobile workforces in the field.

I designed the TeamHaven platform from the ground up. It was built on SQL Server using a single, multi-tenant data model, with an ASP.NET web front end that provided secure login, user management, and remote access for both office staff and field teams.

Field representatives could print questionnaires to complete while in store, then enter the collected data into TeamHaven at the end of their day, ensuring accurate and structured reporting from the field.

In retrospect, one of the most important contributions I made was steering TeamHaven through a common early-stage pitfall. While pursuing early customers, there was strong pressure to build bespoke features for each client. That path would have fragmented the user experience and the platform itself. Instead, I prioritised generic, configurable capabilities that customers could tailor to their own workflows — preserving a coherent product while still delivering the flexibility they needed.

These extensibility points became a major differentiator for TeamHaven. They allowed us to bring in additional developers to build bespoke extensions without compromising the integrity of the core platform.

This approach evolved into a fully featured web API, enabling customers’ own systems to receive notifications of critical events — such as a representative completing a questionnaire — and retrieve data on demand as their workflows required.

Our more sophisticated customers required mobile data entry via handheld devices running Windows Mobile — a very new frontier at the time. I pioneered database synchronisation techniques designed to operate within extremely limited 2G bandwidth constraints, ensuring reliable data transfer between devices and the central platform.

I also developed bespoke automatic update mechanisms that allowed us to deploy and manage software across field forces numbering in the hundreds and thousands of devices, ensuring they remained secure, consistent, and up to date with the latest TeamHaven functionality.

As TeamHaven scaled from handling hundreds of thousands to millions of visits annually, I continuously evolved the platform to meet increasing demands.

We transitioned from dedicated hosted hardware to Windows Azure virtual machines, and later to Kubernetes-based infrastructure to improve scalability, resilience, and operational efficiency.

I also decomposed the platform into background worker services, enabling asynchronous message processing. This improved front-end responsiveness while introducing eventual consistency patterns that allowed the system to scale reliably under heavy load.

Beyond the technological achievements, I am particularly proud of the customer experience we delivered. TeamHaven was highly customisable, including a reskinning capability that allowed customers to present the platform as their own.

Combined with a powerful web API, this enabled clients to deliver seamless, fully integrated experiences to their own customers.

With a core team of just five people — including two developers — we supported customers across multiple countries, time zones, and languages, delivering full localisation and dependable service at global scale.

After nearly 15 years building and evolving TeamHaven, I chose to step away from the business and sell my share to my remaining partner in order to pursue a new venture and fresh technical challenges.
