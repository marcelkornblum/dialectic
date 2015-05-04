from django.conf.urls import patterns, include, url
from . import views

urlpatterns = patterns('',
    url(r'^$', views.policy_list, name='policies_policy_list'),
    url(r'^(?P<policy_id>[0-9]+)/$', views.policy_detail, name='policies_policy_detail'),
    url(r'^debate/$', views.topic_list, name='policies_topic_list'),
    url(r'^debate/(?P<topic_id>[0-9]+)/$', views.topic_detail, name='policies_topic_detail'),
    url(r'^debate/(?P<topic_id>[0-9]+)/policy/add/$', views.policy_add, name='policies_policy_add'),
    url(r'^debate/(?P<topic_id>[0-9]+)/evidence/add/$', views.evidence_add, name='policies_evidence_add'),
)
