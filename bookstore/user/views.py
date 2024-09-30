from django.shortcuts import render
from user.models import CustomUser
from rest_framework import viewsets
from user.serializers import UserSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


