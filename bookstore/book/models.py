from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.TextField()
    author = models.TextField()
    publisher = models.TextField()
    url = models.TextField()
    available = models.BooleanField(default=True)
    public_year = models.IntegerField(default=2000)
    number = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.title} by {self.author}'