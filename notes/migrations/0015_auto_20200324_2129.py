# Generated by Django 3.0.4 on 2020-03-24 21:29

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0014_auto_20200324_2128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='notes',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, null=True, size=None),
        ),
    ]
