from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^accounts/', include('userena.urls')),
    url(r'^policies/', include('policies.urls')),
    url(r'^vote/', include('voting.urls')),
    url(r'^$', 'dialectic.views.home', name='home'),

    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # url(r'^api-token-auth/', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^comments/', include('fluent_comments.urls')),
    url(r'^direct-messages/', include('userena.contrib.umessages.urls')),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)