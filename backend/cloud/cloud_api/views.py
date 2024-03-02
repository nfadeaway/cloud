import os

from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password
from django.http import FileResponse
from django.middleware.csrf import get_token
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cloud.settings import MEDIA_ROOT
from .models import CloudUser, File
from .permissions import IsAdmin, IsAdminOrUser, IsAdminOrFileOwner
from .serializers import CloudUserSerializer, FileSerializer, CloudUsersDetailSerializer
from .utils import generate_external_link_key


class CloudUserAPICreate(generics.CreateAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUserSerializer

    def perform_create(self, serializer):
        username = serializer.validated_data['username']
        password = make_password(serializer.validated_data['password'])
        serializer.save(storage_directory=username, password=password, is_staff=True, is_active=True)


class UserLoginAPIView(APIView):
    def post(self, request, format=None):
        if request.user.is_authenticated:
            return Response({'detail': 'Пользователь уже аутентифицирован.'}, status=status.HTTP_200_OK)
        else:
            username = request.data.get('username')
            password = request.data.get('password')
        if username is None or password is None:
            return Response({'detail': 'Укажите логин и пароль.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'detail': 'Неверные данные.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            login(request, user)
            return Response(
                {
                    'detail': 'Успешный вход в систему.',
                    'userID': user.id,
                    'username': user.username,
                    'isAdmin': request.user.is_superuser
                },
                status=status.HTTP_200_OK
            )


class UserLogoutAPIView(APIView):
    @staticmethod
    def get(request, format=None):
        if not request.user.is_authenticated:
            return Response({'detail': 'Пользователь не аутентифицирован'}, status=status.HTTP_400_BAD_REQUEST)

        logout(request)
        return Response({'detail': 'Успешный выход из системы.'}, status=status.HTTP_200_OK)


class SessionView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return Response(
            {
                'detail': 'Пользователь успешно аутентифицирован.',
                'userID': request.user.id,
                'username': request.user.username,
                'isAdmin': request.user.is_superuser
            },
            status=status.HTTP_200_OK
        )


class CSRFTokenView(APIView):
    @staticmethod
    def get(request, format=None):
        csrf_token = get_token(request)
        return Response({'csrf': csrf_token}, status=status.HTTP_200_OK)


class CloudUserAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUserSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        instance.delete()
        instance.delete_storage()


class CloudUserAPIList(generics.ListAPIView):
    queryset = CloudUser.objects.all().order_by('-date_joined')
    serializer_class = CloudUsersDetailSerializer
    permission_classes = [IsAdmin]


class FileAPICreate(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        file_exist = self.queryset.filter(filename=serializer.validated_data['content'].name).filter(cloud_user=serializer.validated_data['cloud_user'])
        if file_exist:
            raise ValidationError({'content': ['Файл с таким именем уже существует']})
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

    def perform_update(self, serializer):
        if 'filename' in serializer.validated_data:
            file_exist = self.queryset.filter(filename=serializer.validated_data['filename']).filter(cloud_user=self.request.user)
            if file_exist:
                raise ValidationError({'content': ['Файл с таким именем уже существует']})
            old_path = serializer.instance.content.path
            new_filename = serializer.validated_data['filename']
            content = serializer.instance.cloud_user.username + '/' + new_filename
            os.rename(old_path, serializer.instance.content.storage.location + '\\' + serializer.instance.cloud_user.username + '\\' + new_filename)
            serializer.save(content=content)
        else:
            serializer.save()


class UserFilesAPIRetrieve(generics.RetrieveAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUsersDetailSerializer
    permission_classes = [IsAdminOrUser]


class FileAPIDownload(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            file = self.queryset.get(pk=pk)
        except ObjectDoesNotExist:
            raise NotFound(detail=f'Запись о файле c id {pk} не найдена в базе данных')
        self.check_object_permissions(request, file)
        file_path = f'{MEDIA_ROOT}/{file.content}'
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, 'rb'), as_attachment=True)
            response['Access-Control-Expose-Headers'] = 'Filename'
            response['Content-Disposition'] = f'attachment; filename="{file}"'
            response['Filename'] = file
            file.last_download = timezone.now()
            file.save()
            return response
        else:
            return Response({'detail': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)


class FileAPIExternalDownload(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get(self, request, *args, **kwargs):
        link_key = kwargs.get('link_key')
        try:
            file = self.queryset.get(external_link_key=link_key)
        except ObjectDoesNotExist:
            raise ValidationError(detail=f'Запись о файле c ключом {link_key} не найдена в базе данных')
        file_path = f'{MEDIA_ROOT}/{file.content}'
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, 'rb'))
            response['Access-Control-Expose-Headers'] = 'Filename'
            response['Content-Disposition'] = f'attachment; filename="{file}"'
            response['Filename'] = file
            file.last_download = timezone.now()
            file.save()
            return response
        else:
            return Response({'detail': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)


class FileAPICreateExternalLink(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            file = self.queryset.get(pk=pk)
        except ObjectDoesNotExist:
            raise NotFound(detail=f'Запись о файле c id {pk} не найдена в базе данных')
        self.check_object_permissions(request, file)
        for i in range(25):
            external_link_key = generate_external_link_key()
            if File.objects.filter(external_link_key=external_link_key).exists():
                continue
            else:
                file.external_link_key = external_link_key
                file.save()
                return self.retrieve(request, *args, **kwargs)
        else:
            return Response({'detail': 'Не удалось создать ключ внешней ссылки, обратитесь к администратору'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
