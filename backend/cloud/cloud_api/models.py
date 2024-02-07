from django.contrib.auth.models import AbstractUser
from django.db import models

from .utils import get_user_directory_path


class CloudUser(AbstractUser):
    email = models.EmailField(unique=True)
    storage_directory = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username


class File(models.Model):
    cloud_user = models.ForeignKey(CloudUser, on_delete=models.CASCADE, related_name='files')
    filename = models.CharField(max_length=100, blank=True)
    size = models.IntegerField(blank=True)
    comment = models.CharField(max_length=255, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    last_download = models.DateTimeField(null=True)
    external_link = models.URLField(blank=True)
    content = models.FileField(upload_to=get_user_directory_path)

    def __str__(self):
        return self.filename
