from django.db import models
from django.contrib import admin
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django_mysql.models import EnumField
from datetime import datetime
from enum import Enum

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
    url = models.URLField(unique=True) # url for using determen how to handle the communiction with website
    email = models.EmailField()

    @staticmethod
    def fields():
        return ['id', 'name', 'url', 'email'] # id field comes from models.Model

class RackLocation(models.Model):
    geo_location = models.CharField(max_length=122) # Pl Kőbánya
    row = models.IntegerField()
    column = models.IntegerField()
    floor = models.IntegerField()
    section = models.IntegerField()
    barcode = models.CharField(max_length=122)
    fullness_percentage = models.PositiveIntegerField(default=0) # 0-100
    is_putaway = models.BooleanField(default=False) # if it is a putaway box it is true

    @staticmethod
    def fields():
        return ['geo_location', 'row', 'column', 'quantity', 'floor', 'section', 'barcode', 'fullness_percentage', 'is_putaway']

class Product(models.Model):

    SMALL = 'S'
    MEDIUM = 'M'
    LARGE = 'L'
    VERY_LARGE = 'XXL'

    SIZE_CHOICES = [
        (SMALL, 'Small'),
        (MEDIUM, 'Medium'),
        (LARGE, 'Large'),
        (VERY_LARGE, 'Very large'),
    ]

    def only_digit(value):
        if value.isdigit() == False:
            raise DjangoValidationError('Only digit!!!') #params={}

    name = models.CharField(max_length=254)
    barcode = models.CharField(max_length=254, validators=[only_digit])
    item_number = models.CharField(max_length=122) # Cikk_szam
    quantity = models.PositiveIntegerField(default=0)
    webshop_id = models.ForeignKey(WebShop, null=True, on_delete=models.SET_NULL)
    description = models.CharField(max_length=254)
    notification_num = models.PositiveIntegerField(default=0) # mikor eleri a production number ezt a szamit akkor email küldése a webshopnak
    weight = models.PositiveIntegerField(default=0) # [kg]
    size = EnumField(choices=SIZE_CHOICES, default=SMALL)

    @staticmethod
    def fields():
        return ['id', 'name', 'barcode', 'item_number', 'quantity', 'webshop_id', 'description', 'notification_num', 'weight', 'size']

    def validate_unique(self, exclude=None):
        """
            Uniqueness of barcode and time number are check for each webshop not the whole table
        """
        qs_barcode = Product.objects.filter(barcode=self.barcode)
        qs_item_number = Product.objects.filter(item_number=self.item_number)
        qs_name = Product.objects.filter(name=self.name)
        if qs_barcode.filter(webshop_id=self.webshop_id).exists():
            raise ValidationError(detail='Barcode must be unique in one webshop')
        if qs_item_number.filter(webshop_id=self.webshop_id).exists():
            raise ValidationError(detail='Item number must be unique in one webshop')
        if qs_name.filter(webshop_id=self.webshop_id).exists():
            raise ValidationError(detail='Item Name must be unique in one webshop')

    def save(self, *args, **kwargs):
        """
            For check the the uniqueness the save method must be override
        """
        self.validate_unique()
        super(Product, self).save(*args, **kwargs)

class ProductLoction(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    rack_id = models.ForeignKey(RackLocation, on_delete=models.CASCADE)
    product_quantity = models.PositiveIntegerField()

    @staticmethod
    def fields():
        return ['product_id', 'rack_id', 'product_quantity']


class ReceivingPackage(models.Model):

    TAKEN_OVER = 'TK_OV' #átvéve
    SHIPPING = 'SHP' # kiszállítása alatt
    STORED = 'STD' # elraktározva

    RECEIVING_PKG_STATUS = [
        (TAKEN_OVER, 'Taken over'),
        (SHIPPING, 'On shipping'),
        (STORED, 'Stored'),
    ]

    webshop_id = models.ForeignKey(WebShop, null=True, on_delete=models.SET_NULL) # webshop from the package will receive
    track_id = models.CharField(max_length=122, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = EnumField(choices=RECEIVING_PKG_STATUS, default=SHIPPING)
    comment = models.CharField(max_length=254, default='')

class ReceivingItems(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    package_id = models.ForeignKey(ReceivingPackage, related_name='items', on_delete=models.CASCADE)

    @staticmethod
    def fields():
        return ['product_id', 'quantity']


# Create your models here.