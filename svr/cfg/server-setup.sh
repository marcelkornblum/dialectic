#!/bin/bash
# Server Setup
#
# Script to install all the requirements for the server-side part of the dialectic project


# Grab the environment var, default to 'dev'
ENV=${1-dev}
# ... and pick up related vars
source /www/repo/svr/cfg/cfg-$ENV.sh

# Grab the user var, default to 'ubuntu'
USER=${2-ubuntu}

echo -e "\033[0;34m > Provisioning Vagrant server, with the following parameters:\033[0m"
echo -e "\033[0;34m > Environment: $ENV\033[0m"
echo -e "\033[0;34m > Main User:   $USER\033[0m"

# Housekeeping
apt-get update
apt-get install -y git vim

# Web Servers
apt-get install -y nginx supervisor

# Python environment and tools
apt-get install -y python-setuptools python2.7 build-essential python-dev libncurses5-dev fabric
easy_install pip
pip install virtualenv virtualenvwrapper

# Ensure directory and repo in place
mkdir -p /www/$ENV
chown -R $USER:$USER /www
if [ ! -e /www/repo/svr/cfg/cfg-$ENV.sh ]; then
    if [ -d /www/repo ]; then
        su - $USER -c "git -C /www/repo pull"
    else
        su - $USER -c "git clone https://github.com/marcelkornblum/dialectic.git /www/repo"
    fi
    if [ ! -e /www/repo/svr/cfg/cfg-$ENV.sh ]; then
        if [ ! -e /vagrant/cfg/cfg-$ENV.sh ]; then
            echo -e "\033[0;31m >> ENV config file not found. Please ensure it's in the repo and re-provision. << \033[0m"
            exit 1
        else
            source /vagrant/cfg/cfg-$ENV.sh
        fi
    else
        # for first time repo setup, grab the env vars now
        source /www/repo/svr/cfg/cfg-$ENV.sh
    fi
fi

# set up log files
mkdir -p /www/logs
touch /www/logs/gunicorn_supervisor.$ENV.log
touch /www/logs/gunicorn.$ENV.log
touch /www/logs/nginx-access.$ENV.log
touch /www/logs/nginx-error.$ENV.log
chown -R www-data:$USER /www/logs
chmod -R 775 /www/logs


# Postgres DB setup
echo -e "\033[0;34m > Setting up DB. If it already exists this will generate warnings, but no harm will be done.\033[0m"
apt-get install -y postgresql-9.3 postgresql-client-9.3 postgresql-server-dev-9.3
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME ENCODING='UTF8' TEMPLATE=template0;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
if [ $ENV == 'dev' -o $ENV == 'test' ]; then
        sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
fi

# do the rest as the user we'll be logging in as through SSH
chmod +x /www/repo/svr/cfg/server-setup-user.sh
sudo -u $USER /www/repo/svr/cfg/server-setup-user.sh $ENV $USER

# Set up supervisor conf to point to the one in this repo
if [ ! -h /etc/supervisor/conf.d/gunicorn.$ENV.supervisor.conf ]; then
    ln -s /www/$ENV/current/cfg/files/gunicorn.$ENV.supervisor.conf /etc/supervisor/conf.d/gunicorn.$ENV.supervisor.conf
fi

# ...and the nginx configs
if [ ! -e /etc/nginx/sites-enabled/default.nginx.conf ]; then
    mv /www/$ENV/current/cfg/files/default.nginx.conf /etc/nginx/sites-enabled/
fi
if [ ! -h /etc/nginx/sites-enabled/dialectic.$ENV.nginx.conf ]; then
    ln -s /www/$ENV/current/cfg/files/dialectic.$ENV.nginx.conf /etc/nginx/sites-enabled/dialectic.$ENV.nginx.conf
fi