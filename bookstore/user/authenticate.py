# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from user.models import CustomUser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response("User registered successfully", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                userModel = CustomUser.objects.get(email=request.data.get('email'))
                user = UserSerializer(userModel).data
                tokens = serializer.get_tokens(userModel, user)
                return Response(tokens, status=status.HTTP_200_OK)
            except Exception as ex:
                print(ex)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
