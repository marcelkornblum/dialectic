from django.conf.urls import patterns, include, url
from . import views

urlpatterns = patterns('',
    url(r'^(?P<app_name>[a-zA-Z]+)/(?P<model_name>[a-zA-Z]+)/(?P<object_id>[0-9]+)/up$', views.voteup, name='voting_voteup'),
    url(r'^(?P<app_name>[a-zA-Z]+)/(?P<model_name>[a-zA-Z]+)/(?P<object_id>[0-9]+)/down$', views.votedown, name='voting_votedown'),
)
