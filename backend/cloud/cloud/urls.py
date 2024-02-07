from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from cloud_api.urls import api_router
from cloud_api.views import CloudUserAPICreate, CloudUserAPIRetrieveUpdateDestroy, CloudUserAPIList, FileAPIList, \
    FileAPIRetrieveUpdateDestroy, FileAPICreate, FileAPIDownload

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include(api_router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/users/', CloudUserAPIList.as_view()),
    path('api/users/registration/', CloudUserAPICreate.as_view()),
    path('api/users/<int:pk>/', CloudUserAPIRetrieveUpdateDestroy.as_view()),
    path('api/files/', FileAPIList.as_view()),
    path('api/files/add/', FileAPICreate.as_view()),
    path('api/files/<int:pk>/', FileAPIRetrieveUpdateDestroy.as_view()),
    path('api/files/<int:pk>/download/', FileAPIDownload.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
