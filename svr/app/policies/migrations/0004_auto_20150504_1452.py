# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0003_evidence'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='evidence',
            options={'verbose_name_plural': 'evidence', 'permissions': (('can_vote_up', 'Upvote Evidence'), ('can_vote_down', 'Downvote Evidence'))},
        ),
        migrations.AlterModelOptions(
            name='policy',
            options={'verbose_name_plural': 'policies', 'permissions': (('can_vote_up', 'Upvote Policy'), ('can_vote_down', 'Downvote Policy'))},
        ),
        migrations.AlterModelOptions(
            name='topic',
            options={'permissions': (('can_vote_up', 'Upvote Topic'), ('can_vote_down', 'Downvote Topic'))},
        ),
        migrations.RenameField(
            model_name='policy',
            old_name='selected',
            new_name='is_selected',
        ),
        migrations.AddField(
            model_name='evidence',
            name='description',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='evidence',
            name='summary',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='policy',
            name='description',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='policy',
            name='summary',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='topic',
            name='description',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='topic',
            name='summary',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
    ]
