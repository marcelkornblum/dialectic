# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='policy',
            name='selected',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='policy',
            name='state',
            field=django_fsm.FSMField(default=b'draft', max_length=50),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='topic',
            name='state',
            field=django_fsm.FSMField(default=b'draft', max_length=50),
            preserve_default=True,
        ),
    ]
