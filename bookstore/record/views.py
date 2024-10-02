from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from book.models import Book
from record.models import Record
from user.models import CustomUser
from django.utils import timezone


from book.serializers import BookSerializer
from record.serializers import RecordSerializer
from user.serializers import UserSerializer

# Create your views here.
class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST'], url_path='borrow')
    def borrow(self, request):
        try:
            userId = request.data.get('userId')
            bookId = request.data.get('bookId')
            book = Book.objects.get(pk=bookId)
            if not book.available:
                return Response({'error': 'Book not available'}, status=status.HTTP_400_BAD_REQUEST)
            user = CustomUser.objects.get(pk=userId)
            # Tạo bản ghi BorrowRecord
            Record.objects.create(user=user, book=book)
            book.available = False
            book.save()
            return Response({'status': 'Book borrowed successfully'})
        except Exception as ex:
            print(ex)
            return Response('', status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], url_path='return')
    def return_book(self, request, pk=None):
        try:
            userId = request.data.get('userId')
            bookId = request.data.get('bookId')
            book = Book.objects.get(pk=bookId)
            borrow_record = Record.objects.get(book=bookId, user=userId, status='borrowed')
            # Cập nhật trạng thái mượn trả
            borrow_record.status = 'returned'
            borrow_record.return_date = timezone.now()
            borrow_record.save()
            book.available = True
            book.save()
            return Response({'status': 'Book returned successfully'})
        except Exception as ex:
            print(ex)
            return Response({'error': 'No active borrow record found'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def get_by_user_id(self, request, pk=None):
        try:
            userId = request.get('q', 'userId')
            borrow_records = Record.objects.filter(user=userId)
            return Response(borrow_records)
        except Exception as ex:
            print(ex)
            return Response('Nothing', status=status.HTTP_204_NO_CONTENT)