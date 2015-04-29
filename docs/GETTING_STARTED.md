# Getting Started

If you haven't already, you may want to explore the guidelines for [developing](./DEVELOPING.md) and the [system overview](./SYSTEM.md) before you get started.

## Prerequisites

The following tools and libraries will need to be present on the computer you're coding on in order to run the development environment.

First of all, to get the codebase you need [Git](http://git-scm.com/), and ideally a [GitHub](https://github.com) account.

For the server side, you'll need:

- [VirtualBox](https://www.virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)
- An [Amazon AWS account](http://aws.amazon.com/) (note that this could generate costs, which are usage based and typically less than GBP£1/month for a dev environment)

All the other components are installed on a virtual machine with a guest operating system, keeping your own machine relatively free of new installations.

Client-side development will usually require a back end, but in addition you'll need the following tools in order to follow the development process used for this project:

- [NodeJS](http://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [Gulp](http://gulpjs.com/)
- [Yeoman](http://yeoman.io/)
- [Bower](http://bower.io/)
- [SASS](http://sass-lang.com/) compiler (?)

Once you've got all the above installed on your system, fork the repository and then clone your fork locally.

## Server side

First of all, you need some local dev settings to use. Save a copy of the `svr/cfg/cfg-tpl.sh` file as `svr/cfg/cfg-dev.sh`, making any changes to the settings that you like and including your [AWS key and secret](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html). This new file should be ignored by Git and not committed in order that your credentials remain safe.

Once this is done, on the command line, navigate to the `svr` directory and start the Vagrant instance, then log into the instance to run the application. Simply paste the following commands into your terminal to get going:

- `cd svr` (assuming you're starting in the repo root folder)
- copy the `/svr/cfg/cfg-tpl.sh` to `/svr/cfg/cfg-local.sh`, changing any of the values in that file.
- `vagrant up` (this will download the `trusty` image and then run the shell provisioning script. The first time you run this it will take some time and use several GB of space on your hard drive, as well as bandwidth)
- `vagrant ssh` (this will log you into the guest machine)
- `fab update` (this will ensure the server-side requirements are up-to-date on the vagrant instance. You should do this each time you pull from a remote repository.)
- `fab importdb` (this will load up a development database into your local instance. You can do this any time you want to 'start fresh' with a clean database)
- `fab app` (this will start the server in local development mode)

The first time it starts, vagrant will download the basic image with the guest operating system (Ubuntu), and then provision the instance with all the required software, tools and configuration.

Your server-side environment should have been fully created and configured by the shell script at `svr/cfg/server-setup.sh`, which runs as `root` but which triggers the running of `svr/cfg/server-setup-user.sh` as the `vagrant` user on your new machine. By default the instance will be configured as a 'dev' environment.

Once you've logged in to the machine via SSH, you should be able to use [Fabric](http://www.fabfile.org/) commands to do most of the admin tasks you may require.

Running `fab update` will do a `pip install` of the relevant requirements files (`svr/cfg/requirements/base.txt` plus the relevant one for your environment), then run the Django `collectstatic` and `migrate` commands.

`fab importdb` runs a script that grabs the latest version of the development database and imports it into your vagrant instance's database server. By default this will load the development dataset; other datasets are available through the `fab importdb:db=staging` argument syntax.

`fab app` will execute the Django `runserver` command and will allow you to access the server from your host (i.e. "normal") machine environment at [http://localhost:8888](http://localhost:8888).

More Fabric commands are available; type `fab --list` to see them all.

To finish up a session, `exit` the vagrant guest console and `vagrant halt`, which will shut down the guest instance.

## Client side

Once you have your server-side code in place and your local back end running, you can install your client side dev tools.

This is all done from your host machine by default. Navigate to the `clt` directory, install your npm and bower modules, and then get gulp to give you a local dev server. Simply paste the following commands into your terminal to get going:

- `cd clt` (assuming you're starting in the repo root folder)
- `npm install`
- `bower install`
- `yo ...`
- `gulp`

... TO BE COMPLETED ...