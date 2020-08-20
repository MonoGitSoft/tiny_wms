from rest_framework import serializers
from .models import *


class WebShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebShop
        fields = WebShop.fields()


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = Product.fields()


class RackSerializer(serializers.ModelSerializer):
    class Meta:
        model = RackLocation
        fields = RackLocation.fields()


class ProductLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLoction
        fields = ProductLoction.fields()