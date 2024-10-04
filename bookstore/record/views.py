from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from book.models import Book
from record.models import Record
from user.models import CustomUser
from django.utils import timezone
from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from record.filter import RecordFilter

from book.serializers import BookSerializer
from record.serializers import RecordSerializer
from user.serializers import UserSerializer

class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RecordFilter
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST'], url_path='borrow')
    def borrow(self, request):
        try:
            userId = request.data.get('userId')
            bookId = request.data.get('bookId')
            book = Book.objects.get(pk=bookId)
            user = CustomUser.objects.get(pk=userId)
            list_borrowed = self.get_list_borrow(bookId)
            print(list_borrowed)
            if len(list_borrowed) >= book.number:
                return Response('There are not book available', status=status.HTTP_204_NO_CONTENT)
            # Tạo bản ghi BorrowRecord
            Record.objects.create(user=user, book=book)
            book.save()
            return Response({'status': 'Book borrowed successfully'})
        except Exception as ex:
            print(ex)
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)
         
    @action(detail=False, methods=['POST'], url_path='accept_borrow')
    def accept_borrow(self, request):
        try:
            userId = request.data.get('userId')
            bookId = request.data.get('bookId')
            # Find record request
            record = Record.objects.get(user=userId, book=bookId, status = 'pending')
            record.status = 'borrowed'
            # Save
            record.save()
            return Response({'status': 'Book borrowed successfully'})
        except Exception as ex:
            print(ex)
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)

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
            book.save()
            return Response({'status': 'Book returned successfully'})
        except Exception as ex:
            print(ex)
            return Response({'error': 'No active borrow record found'}, status=status.HTTP_204_NO_CONTENT)
        
    @action(detail=False, methods=['POST'], url_path='accept_return')
    def accept_return(self, request):
        try:
            userId = request.data.get('userId')
            bookId = request.data.get('bookId')
            # Find record request
            record = Record.objects.get(user=userId, book=bookId, status = 'borrowed')
            record.status = 'return'
            # Save
            record.save()
            return Response({'status': 'Book borrowed successfully'})
        except Exception as ex:
            print(ex)
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)
        
    @action(detail=False, methods=['POST'], url_path='get_status_book')
    def get_status_book(self, request):
        try:
            userId = request.data.get('userId')
            bookId = request.data.get('bookId')
            data = Record.objects.filter(user=userId, book=bookId).values()
            return Response(list(data))
        except Exception as ex:
            print(ex)
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['GET'], url_path='get_by_user_id')
    def get_by_user_id(self, request):
        try:
            print('start')
            userId = request.GET.get('userId')
            print(userId)
            borrow_records = Record.objects.filter(user=userId).values()
            return Response(list(borrow_records))
        except Exception as ex:
            print(ex)
            return Response('Nothing', status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def get_number_borrow(self, request):
        try:
            bookId = request.GET.get('bookId')
            borrow_records = self.get_list_borrow(bookId)
            return Response(list(borrow_records))
        except Exception as ex:
            print(ex)
            return Response('Nothing', status=status.HTTP_204_NO_CONTENT)
    
    def get_list_borrow(self, bookId):
        print(bookId)
        return Record.objects.filter(book=bookId, status = 'borrowed').values()