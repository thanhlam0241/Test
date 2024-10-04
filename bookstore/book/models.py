from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.TextField(default='')

# Create your models here.
class Book(models.Model):
    title = models.TextField(default='')
    author = models.TextField(default='')
    publisher = models.TextField(default='')
    url = models.TextField(default='')
    description = models.TextField(default='')
    public_year = models.IntegerField(default=2000)
    number = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return f'{self.title} by {self.author}'