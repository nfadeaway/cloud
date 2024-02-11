from django.urls import path

from .views import CloudUserAPICreate, CloudUserAPIList, CloudUserAPIRetrieveUpdateDestroy, FileAPIList, FileAPICreate, \
    FileAPIRetrieveUpdateDestroy, FileAPIDownload, FileAPICreateExternalLink, FileAPIExternalDownload, UserLoginAPIView, \
    UserLogoutAPIView, SessionView, CSRFTokenView

urlpatterns = [
    path('api/login/', UserLoginAPIView.as_view()),
    path('api/logout/', UserLogoutAPIView.as_view()),
    path('api/session/', SessionView.as_view()),
    path('api/getcsrf/', CSRFTokenView.as_view()),

    path('api/users/', CloudUserAPIList.as_view()),
    path('api/users/registration/', CloudUserAPICreate.as_view()),
    path('api/users/<int:pk>/', CloudUserAPIRetrieveUpdateDestroy.as_view()),

    path('api/files/', FileAPIList.as_view()),
    path('api/files/add/', FileAPICreate.as_view()),
    path('api/files/<int:pk>/', FileAPIRetrieveUpdateDestroy.as_view()),
    path('api/files/<int:pk>/download/', FileAPIDownload.as_view()),
    path('api/files/<int:pk>/generatelink/', FileAPICreateExternalLink.as_view()),

    path('f/<str:link_key>', FileAPIExternalDownload.as_view()),
]
