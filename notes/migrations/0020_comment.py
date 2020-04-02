# Generated by Django 3.0.4 on 2020-04-02 15:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notes', '0019_song_song_file'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=200, null=True)),
                ('time_stamp', models.DateTimeField()),
                ('song', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='notes1', to='notes.Song')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notes1', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
