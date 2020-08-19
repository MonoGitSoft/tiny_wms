from django.db import models

class WebShop(models.Model):
    name = models.CharField(max_length=254)
    url = models.URLField()
    email = models.EmailField()
    tpye = models.CharField(max_length=122, default='UKNOWN') # What kind of webshop motor is used (example wocommerce or shoprenter etc)

class Product(models.Model):
    name = models.CharField(max_length=254)
    barcode = models.CharField(max_length=254)
    quantity = models.IntegerField(default=0)
    webshopId = models.ForeignKey(WebShop, on_delete=models.SET_NULL)

# Create your models here.