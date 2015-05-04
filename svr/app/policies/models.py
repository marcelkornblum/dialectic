import reversion

from django.db import models

from django_fsm import FSMField, transition

from voting.mixins import VoteMixin


class TopicQuerySet(models.query.QuerySet):
    """Custom queryset for Topic models."""

    def open(self):
        return self.filter(state='open')

    def closed(self):
        return self.filter(state='closed')

    def draft(self):
        return self.filter(state='draft')


class TopicManager(models.Manager):

    def get_queryset(self):
        "Bind the manager to the custom queryset class."
        return TopicQuerySet(self.model, using=self._db)

    def open(self):
        "Return open Topics."
        return self.get_queryset().open()

    def closed(self):
        "Return closed Topics."
        return self.get_queryset().closed()

    def draft(self):
        "Return draft Topics."
        return self.get_queryset().draft()


@reversion.register
class Topic(VoteMixin):
    """
    A general topic for debate. Each topic should result in a policy after
    debate, or in a choice of policies during debate.

    FSM States:
    Draft: not visible publicly
    Open: being debated
    Closed: debate finished, no voting allowed
    """
    name = models.CharField(max_length=200)
    summary = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    state = FSMField(default='draft')

    objects = TopicManager()

    class Meta:
        permissions = (
            ('can_vote_up', 'Upvote Topic'),
            ('can_vote_down', 'Downvote Topic'),
        )

    def __unicode__(self):
        return u'%s' % self.name

    def __repr__(self):
        return u'<policies.Topic #%i: %s>' % (self.pk, self.name)

    @property
    def selected_policy(self):
        """
        Expects a single Policy to be returned; will error otherwise
        """
        return self.policies.get(is_selected=True)

    @transition(field=state, source=['draft', 'closed'], target='open')
    def open(self):
        """
        Changes state of the Topic to 'open'
        """
        pass

    @transition(field=state, source=['open'], target='closed')
    def close(self):
        """
        Changes state of the Topic and each of its Policies to 'closed', but
        only if a single policy is selected
        """
        assert(self.policies.filter(is_selected=True).count() == 1)
        for policy in self.policies:
            policies.close()


class PolicyQuerySet(models.query.QuerySet):
    """Custom queryset for Policy models."""

    def open(self):
        return self.filter(state='open')

    def closed(self):
        return self.filter(state='closed')

    def draft(self):
        return self.filter(state='draft')


class PolicyManager(models.Manager):

    def get_queryset(self):
        "Bind the manager to the custom queryset class."
        return PolicyQuerySet(self.model, using=self._db)

    def open(self):
        "Return open Policies."
        return self.get_queryset().open()

    def closed(self):
        "Return closed Policies."
        return self.get_queryset().closed()

    def draft(self):
        "Return draft Policies."
        return self.get_queryset().draft()


@reversion.register
class Policy(VoteMixin):
    """
    The outcome of a debate on a Topic, a Policy is a voted-for guide to action
    regarding the specified Topic

    FSM States:
    Draft: not visible publicly
    Open: being debated
    Closed: debate finished
    """
    topic = models.ForeignKey(Topic, related_name='policies')
    name = models.CharField(max_length=200)
    summary = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    state = FSMField(default='draft')
    is_selected = models.BooleanField(default=False)

    objects = PolicyManager()

    class Meta:
        verbose_name_plural = 'policies'
        permissions = (
            ('can_vote_up', 'Upvote Policy'),
            ('can_vote_down', 'Downvote Policy'),
        )

    def __unicode__(self):
        return u'%s' % self.name

    def __repr__(self):
        return u'<policies.Policy #%i: %s>' % (self.pk, self.name)

    @property
    def siblings(self):
        return self.topic.policies.exclude(pk=self.pk)


    @transition(field=state, source=['draft', 'closed'], target='open')
    def open(self):
        """
        Changes state of the Policy to 'open'
        """
        pass

    @transition(field=state, source=['open'], target='closed')
    def close(self):
        """
        Changes state of the Policy to 'closed'
        """
        pass

    def select(self, close_topic=True, save=True, force=False):
        """
        This will only succeed if no sibling Policies are already selected,
        unless `force` is set to True. By default, this method will also
        `close` the parent Topic and all sibling Policies, unless `close_topic`
        is set to False
        """
        if force is True:
            self.siblings.update(is_selected=False)
        assert(self.siblings.filter(is_selected=True).count() == 0)

        self.is_selected = True

        if save is True:
            self.save()

        if close_topic is True:
            self.topic.close()

        return self


class EvidenceQuerySet(models.query.QuerySet):
    """Custom queryset for Evidence models."""

    def for_topic(self, topic):
        return self.filter(topic=topic)


class EvidenceManager(models.Manager):

    def get_queryset(self):
        "Bind the manager to the custom queryset class."
        return EvidenceQuerySet(self.model, using=self._db)

    def for_topic(self, topic):
        "Return evidence for thje given Topic."
        return self.get_queryset().for_topic(topic)


class Evidence(VoteMixin):
    topic = models.ForeignKey(Topic, related_name='evidence')
    name = models.CharField(max_length=200)
    summary = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    file = models.FileField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)

    objects = EvidenceManager()

    class Meta:
        verbose_name_plural = "evidence"
        permissions = (
            ('can_vote_up', 'Upvote Evidence'),
            ('can_vote_down', 'Downvote Evidence'),
        )

    def __unicode__(self):
        return u'%s' % self.name
