#!/bin/bash
# Server Setup
#
# Script to install all the requirements for the server-side part of the dialectic project. Run as root.


# Grab the environment var, default to 'local'
ENV=${1-local}
# ... and pick up related vars
source /var/www/repo/svr/cfg/cfg-$ENV.sh

# Grab the user var, default to 'ubuntu'
USER=${2-ubuntu}

echo -e "\033[0;34m > Provisioning Vagrant server, with the following parameters:\033[0m"
echo -e "\033[0;34m > Environment: $ENV\033[0m"
echo -e "\033[0;34m > Main User:   $USER\033[0m"

# ElasticSearch and Java
add-apt-repository ppa:webupd8team/java -y
wget -q https://packages.elasticsearch.org/GPG-KEY-elasticsearch -O- | sudo apt-key add -
echo "deb http://packages.elasticsearch.org/elasticsearch/1.5/debian stable main" | sudo tee -a /etc/apt/sources.list
apt-get update
# the installer asks for input, which we want to suppress. Luckily someone figured out how...
# http://askubuntu.com/questions/190582/installing-java-automatically-with-silent-option
echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections
apt-get install oracle-java7-installer -y
apt-get install elasticsearch -y
update-rc.d elasticsearch defaults 95 10
service elasticsearch start

# Housekeeping
apt-get install -y git vim curl

# Web Servers
apt-get install -y nginx supervisor

# Python environment and tools
apt-get install -y python-setuptools python2.7 build-essential python-dev fabric
easy_install pip
pip install virtualenv virtualenvwrapper

# App requirements
apt-get install libncurses5-dev libffi-dev libssl-dev libjpeg-dev

# Ensure directory and repo in place
mkdir -p /var/www/$ENV
chown -R $USER:$USER /var/www
if [ ! -e /var/www/repo/svr/cfg/cfg-$ENV.sh ]; then
    if [ ! -d /var/www/repo ]; then
        su - $USER -c "git clone https://github.com/marcelkornblum/dialectic.git /var/www/repo"
    fi
    if [ ! -e /var/www/repo/svr/cfg/cfg-$ENV.sh ]; then
        if [ ! -e /vagrant/cfg/cfg-$ENV.sh ]; then
            echo -e "\033[0;31m >> ENV config file not found. Please ensure it's in the repo and re-provision. << \033[0m"
            exit 1
        else
            echo -e "\033[0;31m >> ENV config file found in local /vagrant shared folder. << \033[0m"
            source /vagrant/cfg/cfg-$ENV.sh
        fi
    else
        # for first time repo setup, grab the env vars now
        source /var/www/repo/svr/cfg/cfg-$ENV.sh
    fi
    su - $USER -c "git -C /var/www/repo pull origin $GIT_BRANCH"
fi

if [ $ENV != 'local' ]; then
    # set up log files
    mkdir -p /var/www/logs/$ENV
    touch /var/www/logs/$ENV/gunicorn_supervisor.log
    touch /var/www/logs/$ENV/gunicorn.log
    touch /var/www/logs/$ENV/nginx-access.log
    touch /var/www/logs/$ENV/nginx-error.log
    chown -R www-data:$USER /var/www/logs/$ENV
    chmod -R 775 /var/www/logs/$ENV
fi

# Postgres DB setup
echo -e "\033[0;34m > Setting up DB. If it already exists this will generate warnings, but no harm will be done.\033[0m"
apt-get install -y postgresql-9.3 postgresql-client-9.3 postgresql-server-dev-9.3
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME ENCODING='UTF8' TEMPLATE=template0;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
if [[ $ENV == 'dev' || $ENV == 'test' || $ENV == 'local' ]]; then
        sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
fi

if [ $ENV != 'local' ]; then
    # Run a deployment so the code is in the right place
    chmod +x /var/www/repo/svr/cfg/server-deploy.sh
    /var/www/repo/svr/cfg/server-deploy.sh $ENV $USER
fi

if [ $ENV != 'local' ]; then
    USER_SCRIPT=/var/www/repo/svr/cfg/server-setup-user.sh
else
    USER_SCRIPT=/vagrant/cfg/server-setup-user.sh
fi

# front end tools setup
apt-get install -y ruby-full nodejs npm
sudo ln -s "$(which nodejs)" /usr/bin/node
npm install -g bower gulp
gem install bundler foundation sass compass

# do the rest as the user we'll be logging in as through SSH
chmod +x $USER_SCRIPT
sudo -u $USER $USER_SCRIPT $ENV $USER

if [ $ENV != 'local' ]; then
    # Set up supervisor conf to point to the one in this repo
    if [ ! -h /etc/supervisor/conf.d/gunicorn.$ENV.supervisor.conf ]; then
        ln -s /var/www/$ENV/current/cfg/files/gunicorn.$ENV.supervisor.conf /etc/supervisor/conf.d/gunicorn.$ENV.supervisor.conf
    fi

    # ...and the nginx configs
    if [ ! -e /etc/nginx/sites-enabled/default.nginx.conf ]; then
        mv /var/www/$ENV/current/cfg/files/default.nginx.conf /etc/nginx/sites-enabled/
    fi
    if [ ! -h /etc/nginx/sites-enabled/dialectic.$ENV.nginx.conf ]; then
        ln -s /var/www/$ENV/current/cfg/files/dialectic.$ENV.nginx.conf /etc/nginx/sites-enabled/dialectic.$ENV.nginx.conf
    fi
else
    # link the FE folder to a place django can find it
     ln -s /client /vagrant/app/dialectic/static/foundation
fi