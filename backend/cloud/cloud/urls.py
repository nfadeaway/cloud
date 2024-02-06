from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from cloud_api.urls import api_router


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
