from django.conf.urls import patterns, include, url
from . import views

urlpatterns = patterns('',
    url(r'^$', views.topic_list, name='topic_list'),
    url(r'^(?P<topic_id>[0-9]+)/$', views.topic_detail, name='topic_detail'),
    # url(r'^$', views.policy_list, name='policy_list'),
    # url(r'^(?P<policy_id>[0-9]+)/$', views.policy_detail, name='policy_detail'),
)
