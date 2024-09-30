from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from book.models import Book
from record.models import Record

from book.serializers import BookSerializer
from record.serializers import RecordSerializer

# Create your views here.
class RecordViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Record.objects.all()
    serializer_class = Record
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def borrow(self, request, pk=None):
        book = self.get_object()
        if not book.available:
            return Response({'error': 'Book not available'}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo bản ghi BorrowRecord
        Record.objects.create(user=request.user, book=book)
        book.available = False
        book.save()
        return Response({'status': 'Book borrowed successfully'})

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        book = self.get_object()
        borrow_record = Record.objects.filter(book=book, user=request.user, status='borrowed').first()
        if not borrow_record:
            return Response({'error': 'No active borrow record found'}, status=status.HTTP_400_BAD_REQUEST)

        # Cập nhật trạng thái mượn trả
        borrow_record.status = 'returned'
        borrow_record.return_date = timezone.now()
        borrow_record.save()
        book.available = True
        book.save()
        return Response({'status': 'Book returned successfully'})