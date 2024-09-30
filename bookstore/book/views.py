from rest_framework.permissions import IsAuthenticated
from book.models import Book
from rest_framework import viewsets
from book.serializers import BookSerializer
# Create your views here.


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
