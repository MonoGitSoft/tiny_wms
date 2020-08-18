from django.db import models

class WebShop(models.Model):
    name = models.CharField(max_length=254)
    url = models.URLField()
    email = models.EmailField()

# Create your models here.