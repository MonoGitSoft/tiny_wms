from rest_framework import serializers
from .models import *

class ReceivingItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceivingItems
        fields = ReceivingItems.fields()

class ReceivingPackageSerializer(serializers.ModelSerializer):
    items_set = ReceivingItemsSerializer(many=True)
    class Meta:
        model = ReceivingPackage
        depth = 1
        fields = ['webshop_id', 'track_id', 'comment', 'items_set']

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