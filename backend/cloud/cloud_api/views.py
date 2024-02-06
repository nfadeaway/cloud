from django.contrib.auth.hashers import make_password
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CloudUser, File
from .permissions import IsAdmin, IsAdminOrOwner
from .serializers import CloudUserSerializer, FileSerializer


class CloudUserViewSet(viewsets.ModelViewSet):
    serializer_class = CloudUserSerializer
    queryset = CloudUser.objects.all()

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsAdmin]
        elif self.action == 'retrieve':
            self.permission_classes = [IsAdminOrOwner]
        elif self.action == 'update':
            self.permission_classes = [IsAdminOrOwner]
        elif self.action == 'partial_update':
            self.permission_classes = [IsAdminOrOwner]
        elif self.action == 'destroy':
            self.permission_classes = [IsAdmin]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        username = serializer.validated_data['username']
        password = make_password(serializer.validated_data['password'])
        serializer.save(storage_directory=username, password=password, is_staff=True, is_active=True)


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsAdmin]
        if self.action == 'create':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve':
            self.permission_classes = [IsAdminOrOwner]
        elif self.action == 'update':
            self.permission_classes = [IsAdminOrOwner]
        elif self.action == 'partial_update':
            self.permission_classes = [IsAdminOrOwner]
        elif self.action == 'destroy':
            self.permission_classes = [IsAdminOrOwner]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        uploaded_file_name = serializer.context['request'].FILES['content'].name
        uploaded_file_size = serializer.context['request'].FILES['content'].size
        serializer.save(filename=uploaded_file_name, size=uploaded_file_size)

    def perform_destroy(self, instance):
        storage = instance.content.storage
        path = instance.content.path
        instance.delete()
        storage.delete(path)
