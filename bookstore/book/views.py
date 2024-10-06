from rest_framework.permissions import IsAuthenticated
from book.models import Book, Category
from rest_framework import viewsets
from book.serializers import BookSerializer, CategorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from book.filter import BookFilter
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['GET'], url_path='all')
    def get_all(self, request):
        try:
            data = Category.objects.all().values()
            return JsonResponse({'results': list(data)}, status=status.HTTP_200_OK)
        except Exception as ex:
            print(ex)
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['POST'], url_path='list')
    def get_list(self, request):
        try:
            lst = request.data.get('list')
            data = Category.objects.filter(pk__in=lst).values()
            return JsonResponse({'results': list(data)}, status=status.HTTP_200_OK)
        except Exception as ex:
            print(ex)
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookFilter
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['POST'], url_path='add-category')
    def add_category(self, request):
        try:
            category = Category.objects.get(pk=request.get('categoryId'))
            book = Book.objects.get(pk=request.get('bookId'))
            book.categories.add(category)
            book.save()
            return Response({'status': 'Add categoy successfully'})
        except Exception as ex:
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['POST'], url_path='add-category')
    def remove_category(self, request):
        try:
            category = Category.objects.get(pk=request.get('categoryId'))
            book = Book.objects.get(pk=request.get('bookId'))
            book.categories.remove(category)
            book.save()
            return Response({'status': 'Remove categoy successfully'})
            
        except Exception as ex:
            return Response('Error occur', status=status.HTTP_204_NO_CONTENT)
    
    
    
