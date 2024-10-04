from user.models import CustomUser
import django_filters

class CustomUserFilter(django_filters.FilterSet):
    email = django_filters.CharFilter(field_name='email', lookup_expr='icontains')
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = CustomUser
        fields = ['email', 'name']  # Add other fields if needed