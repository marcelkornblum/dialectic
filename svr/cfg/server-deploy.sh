#!/bin/bash
# Server Deploy
#
# Script to copy from the local repo to a the local env subdirectory


# Grab the environment var, default to 'dev'
ENV=${1-dev}
# ... and pick up related vars
source /var/www/repo/svr/cfg/cfg-$ENV.sh

# Grab the user var, default to 'ubuntu'
USER=${2-ubuntu}

DEPLOY_DIR=`date '+%Y%m%d_%H%M%S'`

echo -e "\033[0;34m > Deploying with the following parameters:\033[0m"
echo -e "\033[0;34m > Environment: $ENV\033[0m"
echo -e "\033[0;34m > Main User:   $USER\033[0m"
echo -e "\033[0;34m > Directory:   /var/www/$ENV/$DEPLOY_DIR\033[0m"

git archive $GIT_BRANCH | tar -x -C /var/www/$ENV/$DEPLOY_DIR

echo -e "\033[0;34m > Files copied. Symlink being updated\033[0m"
rm -rf /var/www/$ENV/current
ln -s /var/www/$ENV/$DEPLOY_DIR /var/www/$ENV/current

echo -e "\033[0;34m > Old deployment directories being removed.\033[0m"
(cd /var/www/$ENV ; ls -tr | head -n -6 | xargs rm -rf )