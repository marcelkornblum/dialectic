import datetime

from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils import timezone

from genericm2m.models import RelatedObjectsDescriptor

from .models import Vote

class VoteMixin(models.Model):
    """
    Mixin providing a 'through' m2m relationship and helper fields
    and methods to inheriting classes, allowing easy use of the vote app
    """
    votes = RelatedObjectsDescriptor(Vote)

    class Meta:
        abstract = True

    @property
    def upvotes(self):
        return self.votes.filter(is_upvote=True)

    @property
    def downvotes(self):
        return self.votes.filter(is_upvote=False)

    @property
    def vote_count(self):
        return self.upvotes.count() - self.downvotes.count()

    def voteup(self, user):
        return self._create_or_toggle_vote(user, True)

    def votedown(self, user):
        return self._create_or_toggle_vote(user, False)

    def get_vote_for_user(self, user):
        try:
            user_type = ContentType.objects.get(app_label="auth", model="user")
            vote = self.votes.get(object_id=user.pk, object_type=user_type)
            return vote
        except:
            return None

    def _create_or_toggle_vote(self, user, upvote):
        existing_vote = self.get_vote_for_user(user)
        if existing_vote is None:
            return self._create_vote(user, upvote)
        else:
            if existing_vote.is_upvote is None:
                existing_vote.is_upvote = upvote
            else:
                existing_vote.is_upvote = None
            existing_vote.save()
            return existing_vote

    def _create_vote(self, user, upvote):
        return self.votes.connect(user, is_upvote=upvote)


class VoterMixin(models.Model):

    class Meta:
        abstract = True

    @property
    def votes(self):
        user_type = ContentType.objects.get(app_label="auth", model="user")
        return Vote.objects.filter(object_id=self.user.pk, object_type=user_type)

    @property
    def upvotes(self):
        return self.votes.filter(is_upvote=True)

    @property
    def downvotes(self):
        return self.votes.filter(is_upvote=False)

    @property
    def vote_count(self):
        return self.upvotes.count() - self.downvotes.count()

    @property
    def votes_today(self, include_cancelled=False):
        """
        Returns the number of counting votes cast in the previous 24 hours.
        If `all` is True, does not filter out cancelled votes
        """
        user_type = ContentType.objects.get(app_label="auth", model="user")
        date_from = timezone.now() - datetime.timedelta(days=1)
        filters = {
            'object_id': self.user.pk,
            'object_type': user_type,
            'updated_at__gte': date_from
        }
        if include_cancelled is False:
            filters['is_upvote__isnull'] = False
        return Vote.objects.filter(**filters)
