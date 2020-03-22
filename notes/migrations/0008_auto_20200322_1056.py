# Generated by Django 3.0.4 on 2020-03-22 10:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0007_auto_20200321_1738'),
    ]

    operations = [
        migrations.CreateModel(
            name='Dicty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.RemoveField(
            model_name='song',
            name='notes',
        ),
        migrations.AddField(
            model_name='song',
            name='notes',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='notes.Dicty'),
        ),
    ]