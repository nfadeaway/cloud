from rest_framework import serializers

from .models import CloudUser, File


class CloudUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CloudUser
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
