# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0006_auto_20150504_1640'),
    ]

    operations = [
        migrations.CreateModel(
            name='EvidencePolicySupport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('evidence', models.ForeignKey(related_name='supported_policies', to='policies.Evidence')),
                ('policy', models.ForeignKey(related_name='supporting_evidence', to='policies.Policy')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='policy',
            name='con_object',
        ),
        migrations.RemoveField(
            model_name='policy',
            name='pro_object',
        ),
        migrations.AddField(
            model_name='policy',
            name='con',
            field=models.ForeignKey(related_name='policy_con', blank=True, to='policies.PolicyArgument', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='policy',
            name='pro',
            field=models.ForeignKey(related_name='policy_pro', blank=True, to='policies.PolicyArgument', null=True),
            preserve_default=True,
        ),
    ]
