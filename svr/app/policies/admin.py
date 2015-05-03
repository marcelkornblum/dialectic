import reversion

from django.contrib import admin

from .models import Topic, Policy

class TopicAdmin(reversion.VersionAdmin):
    pass

class PolicyAdmin(reversion.VersionAdmin):
    pass

admin.site.register(Topic, TopicAdmin)
admin.site.register(Policy, PolicyAdmin)