"""
URL configuration for bookstore project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from book.views import BookViewSet
from record.views import RecordViewSet
from user.views import UserViewSet
from user.authenticate import RegisterView, LoginView
from rest_framework.authtoken.views import obtain_auth_token 
from debug_toolbar.toolbar import debug_toolbar_urls

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='user')
router.register(r'books', BookViewSet, basename='book')
router.register(r'record', RecordViewSet, basename='record')

urlpatterns = [
    path('api/register', RegisterView.as_view(), name='register'),
    path('api/login', LoginView.as_view(), name='login'),
    path('api/', include(router.urls)),
    path('api/admin/', admin.site.urls),
    path('api/api-token-auth/', obtain_auth_token, name='api_token_auth'), 
    path('api/api-auth/', include('rest_framework.urls'))
] + debug_toolbar_urls()
