from user.models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'is_staff']

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'id', 'is_staff', 'name', 'mobileNumber']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            address=validated_data['address'],
        )
        return user
    
    def getInfo(self, userId):
        user = User.object.filter(email=request.data.get('email'))
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

    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        access['id'] = user.id
        return {
            'refresh': str(refresh),
            'access': str(access),
            'user': str(user)
        }