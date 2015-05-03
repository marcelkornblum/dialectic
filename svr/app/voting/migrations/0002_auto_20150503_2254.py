# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('voting', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='vote',
            unique_together=set([('parent_type', 'parent_id', 'object_type', 'object_id')]),
        ),
    ]
