# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from user.models import CustomUser

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = CustomUser.objects.get(email=request.data.get('email'))
                if user and user.check_password(request.data.get('password')):
                    tokens = serializer.get_tokens(user)
                    return Response(tokens, status=status.HTTP_200_OK)
                else:
                    return Response("Password incorrect", status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                print("User does not exist")
            except User.MultipleObjectsReturned:
                print("Multiple users found with this username")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
