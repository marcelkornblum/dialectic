import os
import sys
import datetime

#
# Paths
#
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_NAME = os.path.basename(BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

def ABS_PATH(*args):
    return os.path.join(BASE_DIR, *args)

def ENV_SETTING(key, default):
    import os
    return os.environ.get(key, default)


MEDIA_ROOT = ABS_PATH('media')
MEDIA_URL = '/media/'
STATIC_ROOT = ABS_PATH('static')
STATIC_URL = '/static/'
ADMIN_MEDIA_PREFIX = '/static/admin/'

STATICFILES_DIRS = (
    ABS_PATH('staticfiles'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)




#
# Security
#
DEBUG = False
TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['*']

LOGIN_REDIRECT_URL = '/home'
LOGIN_URL = '/'

ADMINS = (
    ('Marcel Kornblum', 'me@marcelkornblum.com'),
)
MANAGERS = ADMINS

def ensure_secret_key_file():
    """Checks that secret.py exists in settings dir. If not, creates one
    with a random generated SECRET_KEY setting."""
    secret_path = os.path.join(ABS_PATH('settings'), 'secret.py')
    if not os.path.exists(secret_path):
        from django.utils.crypto import get_random_string
        secret_key = get_random_string(50,
            'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)')
        with open(secret_path, 'w') as f:
            f.write("SECRET_KEY = " + repr(secret_key) + "\n")

# Import the secret key
ensure_secret_key_file()
from .secret import SECRET_KEY  # noqa



#
# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/
LANGUAGE_CODE = 'en-gb'
TIME_ZONE = 'Europe/London'

USE_I18N = True
USE_L10N = True
USE_TZ = True



#
# Templates
#
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    # 'django.template.loaders.eggs.Loader',
)

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or
    # "C:/www/django/templates". Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    ABS_PATH('templates'),
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'dialectic.context_processors.page_title',
    # 'dialectic.context_processors.breadcrumbs'
)




#
# Database
#
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}




#
# Caching
#
CACHES = {
    'default': {
        'BACKEND': ENV_SETTING('CACHE_BACKEND',
            'django.core.cache.backends.dummy.DummyCache')
    }
}




#
# Email
#
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = ''
# EMAIL_PORT = 587
# EMAIL_HOST_USER = ''
# EMAIL_HOST_PASSWORD = ''
# EMAIL_SUBJECT_PREFIX = ''
# EMAIL_USE_TLS = True
# EMAIL_RECIPIENTS = []
# EMAIL_USE_SSL = True
# EMAIL_TIMEOUT,
# EMAIL_SSL_CERTFILE
# EMAIL_SSL_KEYFILE




#
# Sessions
#
SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"



#
# Logging
#
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        # 'file': {
        #     'level': 'DEBUG',
        #     'class': 'logging.FileHandler',
        #     'filename': BASE_DIR + '/debug.log',
        # },
    },
    'loggers': {
        # 'django.request': {
        #     'handlers': ['file'],
        #     'level': 'DEBUG',
        #     'propagate': True,
        # },
    },
}




#
# Application
#
WSGI_APPLICATION = 'dialectic.wsgi.application'
ROOT_URLCONF = PROJECT_NAME + '.urls'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'reversion',
    'storages',
    'corsheaders',
    'genericm2m',
    # 'rest_framework',
    'userena',
    'guardian',
    'easy_thumbnails',
    'userena.contrib.umessages',
    'fluent_comments',
    # 'threadedcomments',
    'django_comments',
    'crispy_forms',

    'accounts', # proxy for userena
    'policies',
    'voting',
)




DEFAULT_PAGE_TITLE = 'Dialectic'




#########################
#                       #
#  Third Party Configs  #
#                       #
#########################




SITE_ID = 1




#
# Userena Profiles, Django Guardian
#
AUTHENTICATION_BACKENDS = (
    'userena.backends.UserenaAuthenticationBackend',
    'guardian.backends.ObjectPermissionBackend',
    'django.contrib.auth.backends.ModelBackend',
)
ANONYMOUS_USER_ID = -1
LOGIN_URL = '/accounts/signin/'
LOGOUT_URL = '/accounts/signout/'
AUTH_PROFILE_MODULE = 'accounts.Citizen'

USERENA_SIGNIN_REDIRECT_URL = '/accounts/%(username)s/'
USERENA_FORBIDDEN_USERNAMES = (
    'signup',
    'signout',
    'signin',
    'activate',
    'me',
    'password',
    'dialectic',
    'populace'
)
USERENA_MUGSHOT_GRAVATAR = True
USERENA_DISABLE_PROFILE_LIST = True
USERENA_HIDE_EMAIL = True




#
# Django Rest Framework
#
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'PAGE_SIZE': 10,
}




#
# JWT Auth
#
JWT_AUTH = {
    'JWT_ENCODE_HANDLER':
    'rest_framework_jwt.utils.jwt_encode_handler',

    'JWT_DECODE_HANDLER':
    'rest_framework_jwt.utils.jwt_decode_handler',

    'JWT_PAYLOAD_HANDLER':
    'rest_framework_jwt.utils.jwt_payload_handler',

    'JWT_PAYLOAD_GET_USER_ID_HANDLER':
    'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler',

    'JWT_RESPONSE_PAYLOAD_HANDLER':
    'rest_framework_jwt.utils.jwt_response_payload_handler',

    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_ALGORITHM': 'HS256',
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LEEWAY': 0,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=300),
    'JWT_AUDIENCE': None,
    'JWT_ISSUER': None,

    'JWT_ALLOW_REFRESH': False,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),

    'JWT_AUTH_HEADER_PREFIX': 'JWT',
}




#
# Django Storages
#
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''
AWS_STATIC_BUCKET_NAME = ""
AWS_WEBSITE_BUCKET_NAME = ""
AWS_STATIC_CUSTOM_DOMAIN = "%s.s3-website-eu-west-1.amazonaws.com" % AWS_STATIC_BUCKET_NAME
AWS_STORAGE_BUCKET_NAME = AWS_STATIC_BUCKET_NAME
STATIC_URL = "http://%s/static/" % AWS_STATIC_CUSTOM_DOMAIN
MEDIA_URL = "http://%s/media/" % AWS_STATIC_CUSTOM_DOMAIN

DEFAULT_FILE_STORAGE = 'dialectic.s3utils.MediaRootS3BotoStorage'
STATICFILES_STORAGE = 'dialectic.s3utils.StaticRootS3BotoStorage'
STATIC_ROOT = ''
AWS_S3_SECURE_URLS = False
AWS_QUERYSTRING_AUTH = False





#
# Fluent Comments
#
FLUENT_COMMENTS_EXCLUDE_FIELDS = ('name', 'email', 'url')
COMMENTS_APP = 'fluent_comments'

















