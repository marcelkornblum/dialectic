from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _

from userena.models import UserenaBaseProfile

from voting.mixins import VoterMixin

class Citizen(UserenaBaseProfile, VoterMixin):
    user = models.OneToOneField(User,
                                unique=True,
                                verbose_name=_('user'),
                                related_name='citizen_profile')