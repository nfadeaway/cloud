from rest_framework.routers import DefaultRouter
from .views import CloudUserViewSet, FileViewSet

api_router = DefaultRouter()
api_router.register('users', CloudUserViewSet)
api_router.register('files', FileViewSet)
