This document details the technologies in use on the server-side part of the project. For an overview of the system as a whole please see [this document](../docs/SYSTEM.md).

# Philosophy

We aim to create a system based entirely on free and open source technologies.

Being right at the beginning of the process, some or all of these technology choices may be changed at a later date, and a few of the initial choices are made pragmatically, and AWS, for example, does not subscribe to the overall philosophy. However, it simplifies deployments involving multiple servers, and makes it easy to create performant systems.

The aim will be to keep all software and libraries up to date as far as possible, and especially with regard to minor versions which ought to be updated regularly.

# Platform

The system is built on open technologies. It should be possible run in a variety of environments, but to start with it's being configured on, and tested against, [Ubuntu 14.04 LTS](https://wiki.ubuntu.com/LTS), which is free and in common use worldwide.

The server stack will be (initially at least) [nginx](http://wiki.nginx.org/Main) and [gunicorn](http://gunicorn.org/), also free and open, and the most commonly used in the Django community.

In addition, it will use [Amazon AWS S3](http://aws.amazon.com/s3/) cloud storage. This is not free, but not expensive, and we'll likely move to another provider at some point.

# Software

The primary software will initially be [Python 2.7](https://www.python.org/download/releases/2.7/), with this version chosen for current widest compatibility with third part Django apps.

The database will be [Postgres 9](http://www.postgresql.org/) although the aim will be, at least initially, to avoid technology-specific functionalit, and the default dev database will be SQLite, for its simplicity of installation.

In addition, there may be a [NodeJS](http://nodejs.org/) component for any socket based functionality, and [Redis](http://redis.io/) for pubsub, and perhaps sessions and caching.

# Frameworks

The main codebase will be written in [Django 1.7](https://www.djangoproject.com/), a free and open source framework in common use.

The Django community creates and supports a range of open source third party "apps", which this system will make use of. The full current list can be seen on the [Credits](../docs/CREDITS.md) page.

The NodeJS community also creates and supports many open tools which will be used in this project, also detailed on the [Credits](../docs/CREDITS.md) page.

# Development setup

For ease of development, all the above server-side components can be easily installed and configured in a [Vagrant](https://www.vagrantup.com/) virtual instance.

By default, Vagrant uses [VirtualBox](https://www.virtualbox.org/) although other virtualisation technologies can be easily substituted.

Both Vagrant and VirtualBox are open and free.

To get started with a development environment, see the [Developing](../docs/DEVELOPING.md) page.
