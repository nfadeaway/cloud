import os

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password
from django.http import FileResponse
from django.utils import timezone
from rest_framework import viewsets, generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cloud.settings import MEDIA_ROOT
from .models import CloudUser, File
from .permissions import IsAdmin, IsAdminOrUser, IsAdminOrFileOwner
from .serializers import CloudUserSerializer, FileSerializer, CloudUsersDetailSerializer


class CloudUserAPICreate(generics.CreateAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUserSerializer

    def perform_create(self, serializer):
        username = serializer.validated_data['username']
        password = make_password(serializer.validated_data['password'])
        serializer.save(storage_directory=username, password=password, is_staff=True, is_active=True)


class CloudUserAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUserSerializer
    permission_classes = [IsAdminOrUser]


class CloudUserAPIList(generics.ListAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUsersDetailSerializer
    permission_classes = [IsAdmin]


class FileAPICreate(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        uploaded_file_name = serializer.validated_data['content'].name
        uploaded_file_size = serializer.validated_data['content'].size
        serializer.save(filename=uploaded_file_name, size=uploaded_file_size)


class FileAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def perform_destroy(self, instance):
        storage = instance.content.storage
        path = instance.content.path
        instance.delete()
        storage.delete(path)


class FileAPIList(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return File.objects.filter(cloud_user=self.request.user)


class FileAPIDownload(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            file = self.queryset.get(pk=pk)
            self.check_object_permissions(request, file)
        except ObjectDoesNotExist:
            raise NotFound(detail=f'Запись о файле c id {pk} не найдена в базе данных')
        file_path = f'{MEDIA_ROOT}/{file.content}'
        if os.path.exists(file_path):
            # file = open(file_path, 'rb')
            response = FileResponse(open(file_path, 'rb'))
            response['Content-Disposition'] = f'attachment; filename="{file}"'
            file.last_download = timezone.now()
            file.save()
            return response
        else:
            return Response({'detail': 'Файл не найден'}, status=404)


# TODO
# class DownloadFileView(APIView):
#
#     def get(self, request, *args, **kwargs):
#         file_path = f'${MEDIA_ROOT}/admin/django.docx'
#         if os.path.exists(file_path):
#             file = open(file_path, 'rb')
#             response = FileResponse(file)
#             response['Content-Disposition'] = 'attachment; filename="django.docx"'
#             return response
#         else:
#             return Response({'error': 'Файл не найден'}, status=404)

#
#
# class CloudUserViewSet(viewsets.ModelViewSet):
#     serializer_class = CloudUserSerializer
#     queryset = CloudUser.objects.all()
#
#     def get_permissions(self):
#         if self.action == 'list':
#             self.permission_classes = [IsAdmin]
#         elif self.action == 'retrieve':
#             self.permission_classes = [IsAdminOrUser]
#         elif self.action == 'update':
#             self.permission_classes = [IsAdminOrUser]
#         elif self.action == 'partial_update':
#             self.permission_classes = [IsAdminOrUser]
#         elif self.action == 'destroy':
#             self.permission_classes = [IsAdmin]
#         return [permission() for permission in self.permission_classes]
#
#     def perform_create(self, serializer):
#         username = serializer.validated_data['username']
#         password = make_password(serializer.validated_data['password'])
#         serializer.save(storage_directory=username, password=password, is_staff=True, is_active=True)
#
#
# class FileViewSet(viewsets.ModelViewSet):
#     serializer_class = FileSerializer
#     queryset = File.objects.all()
#
#     def get_permissions(self):
#         if self.action == 'list':
#             self.permission_classes = [IsAdmin]
#         if self.action == 'create':
#             self.permission_classes = [IsAuthenticated]
#         elif self.action == 'retrieve':
#             self.permission_classes = [IsAdminOrFileOwner]
#         elif self.action == 'update':
#             self.permission_classes = [IsAdminOrFileOwner]
#         elif self.action == 'partial_update':
#             self.permission_classes = [IsAdminOrFileOwner]
#         elif self.action == 'destroy':
#             self.permission_classes = [IsAdminOrFileOwner]
#         return [permission() for permission in self.permission_classes]
#
#     def perform_create(self, serializer):
#         uploaded_file_name = serializer.validated_data['content'].name
#         uploaded_file_size = serializer.validated_data['content'].size
#         serializer.save(filename=uploaded_file_name, size=uploaded_file_size)
#
#     def perform_destroy(self, instance):
#         storage = instance.content.storage
#         path = instance.content.path
#         instance.delete()
#         storage.delete(path)
