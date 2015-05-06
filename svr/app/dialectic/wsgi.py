"""
WSGI config for fells project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
settings_module = os.path.basename(os.path.dirname(__file__)) + '.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()


# Apply WSGI middleware here.
# from helloworld.wsgi import HelloWorldApplication
# application = HelloWorldApplication(application)
try:
    import raven
    from raven.contrib.django.raven_compat.middleware.wsgi import Sentry
    application = Sentry(application)
except ImportError:
    pass



from django.core.wsgi import get_wsgi_application
from dj_static import Cling

application = Cling(get_wsgi_application())