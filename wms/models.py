from django.db import models

class BillingInfo(models.Model):
    country = models.CharField(max_length=122, default='Magyarország') #orszagf
    postcode = models.IntegerField() # iranyitoszam
    city = models.CharField(max_length=122) # település
    district = models.IntegerField(default=None) # kerület
    street_name = models.CharField(max_length=122) #example orlay
    street_type = models.CharField(max_length=122) #utca, út, tér, köz .stb
    house_number = models.IntegerField() #házszám
    tax_number = models.CharField(max_length=122) #adószam
    email = models.EmailField()
    name = models.CharField(max_length=122)


class WebShop(models.Model):
    name = models.CharField(max_length=254, unique=True)
    url = models.URLField(unique=True)
    email = models.EmailField()
    tpye = models.CharField(max_length=122, default='UKNOWN') # What kind of webshop motor is used (example wocommerce or shoprenter etc)

    @staticmethod
    def fields():
        return ['name', 'url', 'email', 'type']

class RackLocation(models.Model):
    geo_location = models.CharField(max_length=122) # Pl Kőbánya
    row = models.IntegerField()
    column = models.IntegerField()
    floor = models.IntegerField()
    section = models.IntegerField()
    barcode = models.CharField(max_length=122)
    fullness_percentage = models.IntegerField(default=0) # 0-100
    is_putaway = models.BooleanField(default=False) # if it is a putaway box it is true

    @staticmethod
    def fields():
        return ['geo_location', 'row', 'column', 'quantity', 'floor', 'section', 'barcode', 'fullness_percentage', 'is_putaway']

class Product(models.Model):
    name = models.CharField(max_length=254, unique=True)
    barcode = models.CharField(max_length=254, unique=True)
    item_number = models.CharField(max_length=122, unique=True)
    quantity = models.IntegerField(default=0)
    webshopId = models.ForeignKey(WebShop, null=True, on_delete=models.SET_NULL)
    description = models.CharField(max_length=254)
    notification_num = models.IntegerField(default=0) # mikor eleri a production number ezt a szamit akkor email küldése a webshopnak

    @staticmethod
    def fields():
        return ['name', 'barcode', 'item_number', 'quantity', 'webshopId', 'description', 'notification_num']

class ProductLoction(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    rack_id = models.ForeignKey(RackLocation, on_delete=models.CASCADE)
    product_quantity = models.IntegerField()

    @staticmethod
    def fields():
        return ['product_id', 'rack_id', 'product_quantity']


# Create your models here.