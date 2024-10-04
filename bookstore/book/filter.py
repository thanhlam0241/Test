from book.models import Book
import django_filters

class BookFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    author = django_filters.CharFilter(field_name='author', lookup_expr='icontains')

    class Meta:
        model = Book
        fields = ['title', 'author']  # Add other fields if needed