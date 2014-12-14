from django.conf import settings
from storages.backends.s3boto import S3BotoStorage


class S3StaticStorage(S3BotoStorage):
    "S3 storage backend that sets the static bucket."
    def __init__(self, *args, **kwargs):
        super(S3StaticStorage, self).__init__(
            bucket=settings.AWS_STATIC_BUCKET_NAME,
            custom_domain=settings.AWS_STATIC_CUSTOM_DOMAIN,
            *args, **kwargs)

    def url(self, name):
        url = super(S3StaticStorage, self).url(name)
        if name.endswith('/') and not url.endswith('/'):
            url += '/'
        return url


StaticRootS3BotoStorage = lambda: S3StaticStorage(location='static')
MediaRootS3BotoStorage  = lambda: S3StaticStorage(location='media')