# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0005_auto_20150504_1543'),
    ]

    operations = [
        migrations.CreateModel(
            name='PolicyArgument',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='policy',
            name='con_object',
            field=models.OneToOneField(related_name='policy_con', null=True, blank=True, to='policies.PolicyArgument'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='policy',
            name='pro_object',
            field=models.OneToOneField(related_name='policy_pro', null=True, blank=True, to='policies.PolicyArgument'),
            preserve_default=True,
        ),
    ]
