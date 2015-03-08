#!/bin/bash

NAME="dialectic"                                    # Name of the application
ENV="dev"                                           # Which environment this script is for
DJANGODIR=/www/$ENV/current/app                      # Django project directory
USER=ubuntu                                         # the user to run as
GROUP=ubuntu                                        # the group to run as
SOCKFILE=/home/$USER/$ENV.gunicorn.sock              # we will communicte using this unix socket
NUM_WORKERS=3                                       # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=dialectic.settings           # which settings file should Django use
DJANGO_WSGI_MODULE=dialectic.wsgi                   # WSGI module name

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
export WORKON_HOME=/home/$USER/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
export PIP_VIRTUALENV_BASE=/home/$USER/.virtualenvs

workon dialectic-$ENV

cd $DJANGODIR
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec /home/ubuntu/.virtualenvs/dialectic-$ENV/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=debug \
  --log-file=/www/logs/$ENV/gunicorn.log \
  --pid=/tmp/nginx.pid