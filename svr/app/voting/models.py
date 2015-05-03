from django.db import models
from genericm2m.models import BaseGFKRelatedObject

class Vote(BaseGFKRelatedObject):
    is_upvote = models.NullBooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('parent_type', 'parent_id', 'object_type', 'object_id')

    def __unicode__(self):
        if self.is_upvote:
            upvote_str = 'for'
        else:
            upvote_str = 'against'
        return u'%s #%i voted %s %s #%i' % (
                self.object_type.name,
                self.object_id,
                upvote_str,
                self.parent_type.name,
                self.parent_id
            )

    def __repr__(self):
        return u'<Vote #%i: %s>' % (self.pk, self.__unicode__())