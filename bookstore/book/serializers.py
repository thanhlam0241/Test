from rest_framework import serializers

from book.models import Book, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = ('id', 'name')

class BookSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Book
        fields = ('id', 'title', 'author', 'description', 'publisher', 
                  'public_year', 'url', 'categories', 'number' ,'price')