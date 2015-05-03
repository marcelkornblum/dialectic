from .base import *

DEBUG = True
TEMPLATE_DEBUG = True

CACHES = {
    'default': {
        'BACKEND': ENV_SETTING('CACHE_BACKEND',
            'django.core.cache.backends.dummy.DummyCache')
    }
}


EMAIL_BACKEND = ENV_SETTING('EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend')
EMAIL_RECIPIENTS = ['me@marcelkornblum.com']



CORS_ORIGIN_ALLOW_ALL = True


# Add SQL statement logging in development
if (ENV_SETTING('SQL_DEBUG', 'false') == 'true'):
    LOGGING['loggers']['django.db'] = {
        'handlers': ['console'],
        'level': 'DEBUG',
        'propagate': False
    }

# set up Django Debug Toolbar if installed
try:
    import debug_toolbar  # noqa
    MIDDLEWARE_CLASSES += (
        # 'debug_toolbar.middleware.DebugToolbarMiddleware',
    )
    INSTALLED_APPS += (
        # 'debug_toolbar',
    )
    # DEBUG_TOOLBAR_CONFIG = {
    #     'INTERCEPT_REDIRECTS': False,
    #     'SHOW_TOOLBAR_CALLBACK': lambda *args, **kwargs: True
    # }
except ImportError:
    pass

# Set up django-extensions if installed
try:
    import django_extensions  # noqa
    INSTALLED_APPS += ('django_extensions',)
except ImportError:
    pass

# INSTALLED_APPS = tuple([x for x in list(INSTALLED_APPS) if x is not 'storages'])
# STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

if DEBUG:
    # make all loggers use the console.
    for logger in LOGGING['loggers']:
        LOGGING['loggers'][logger]['handlers'] = ['console']




# Set up nose as the testrunner
INSTALLED_APPS += ('django_nose',)
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'