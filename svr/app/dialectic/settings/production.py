from .base import *



STATIC_ROOT = ABS_PATH('static')
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

STATICFILES_DIRS = (
    ABS_PATH('staticfiles'),
    ('stylesheets', '/client/stylesheets'),
    ('bower_components', '/client/bower_components'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)