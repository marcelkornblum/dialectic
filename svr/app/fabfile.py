import sys
import os
import json
from fabric.api import local

def update(*args):
    """
    Installs all pip dependencies
    """
    local("pip install -r ../cfg/pip_requirements/base.txt")
    local("pip install -r ../cfg/pip_requirements/dev.txt")

def importdb(*args):
    """
    Gets fixture data and runs migrations; also makes a dummy admin account
    """
    local("python manage.py migrate")

def app(*args):
    """
    Runs the Django devserver on a port coincident with Vagrant's share settings
    """
    local("python manage.py runserver 0.0.0.0:8888")