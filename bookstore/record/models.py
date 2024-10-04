from django.db import models
from user.models import CustomUser
from book.models import Book
# Create your models here.
class Record(models.Model):
    STATUS_CHOICES = (
        ('pending',  'Pending'),
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    

    def __str__(self):
        return f'{self.user.name} borrowed {self.book.title}'