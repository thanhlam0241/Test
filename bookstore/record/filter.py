from record.models import Record
import django_filters

class RecordFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='icontains')

    class Meta:
        model = Record
        fields = ['status']  # Add other fields if needed