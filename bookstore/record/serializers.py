from rest_framework import serializers

from record.models import Record
from book.serializers import BookSerializer
from user.serializers import CustomUser

class RecordSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    user = CustomUser()

    class Meta: 
        model = Record
        fields = ('id', 'user', 'book', 'borrow_date', 'return_date', 'status')