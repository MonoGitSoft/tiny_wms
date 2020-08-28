from rest_framework import serializers
from .models import *


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = Product.fields()


class ReceivingItemsSerializer(serializers.ModelSerializer):
    item_info = ProductSerializer(read_only=True)
    class Meta:
        model = ReceivingItems
        fields = ReceivingItems.fields()


class ReceivingPackageSerializer(serializers.ModelSerializer):
    items = ReceivingItemsSerializer(many=True)

    class Meta:
        model = ReceivingPackage
        fields = ['webshop_id', 'track_id', 'comment', 'items']

    def create(self, validated_data):
        receiving_items_data = validated_data.pop('items')
        receiving_package = ReceivingPackage.objects.create(**validated_data)
        for data in receiving_items_data:
            ReceivingItems.objects.create(package_id=receiving_package, **data)
        return receiving_package


class WebShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebShop
        fields = WebShop.fields()


class RackSerializer(serializers.ModelSerializer):
    class Meta:
        model = RackLocation
        fields = RackLocation.fields()


class ProductLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLoction
        fields = ProductLoction.fields()