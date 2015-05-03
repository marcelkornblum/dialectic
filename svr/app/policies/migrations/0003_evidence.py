# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0002_auto_20150503_1846'),
    ]

    operations = [
        migrations.CreateModel(
            name='Evidence',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('file', models.FileField(null=True, upload_to=b'', blank=True)),
                ('url', models.URLField(null=True, blank=True)),
                ('topic', models.ForeignKey(related_name='evidence', to='policies.Topic')),
            ],
            options={
                'verbose_name_plural': 'evidence',
            },
            bases=(models.Model,),
        ),
    ]
