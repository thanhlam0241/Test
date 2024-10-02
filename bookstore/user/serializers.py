from user.models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'is_staff', 'id', 'name', 'mobileNumber', 'address', 'is_active', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'id', 'is_staff', 'name', 'mobileNumber']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            address=validated_data['address'],
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
        
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")

    def get_tokens(self, user, userData):
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        access['data'] = userData
        return {
            'refresh': str(refresh),
            'access': str(access)
        }