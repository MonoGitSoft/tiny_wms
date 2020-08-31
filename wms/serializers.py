from rest_framework import serializers
from .models import *


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = Product.fields()


class ReceivingItemsSerializer(serializers.ModelSerializer):
    product_info = ProductSerializer(source='product_id', required=False)
    class Meta:
        model = ReceivingItems
        fields = ['product_id', 'quantity', 'received_quantity', 'product_info']

class ReceivingItemRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceivingItems
        fields = ['product_id', 'quantity']


class ReceivingPackageSerializer(serializers.ModelSerializer):
    items = ReceivingItemsSerializer(many=True)
    webshop_name = serializers.CharField(source='webshop_id.name', required=False)
    class Meta:
        model = ReceivingPackage
        fields = ['id','webshop_id', 'track_id', 'comment', 'items', 'webshop_name', 'created_at']

    def create(self, validated_data):
        print(validated_data)
        receiving_items_data = validated_data.pop('items')
        if len(receiving_items_data) == 0:
            raise ValidationError(detail=['Items is missing'])
        receiving_items_data = reduce_multiplicity(receiving_items_data)
        receiving_package = ReceivingPackage.objects.create(**validated_data)
        for data in receiving_items_data:
            ReceivingItems.objects.create(package_id=receiving_package, **data)
        return receiving_package

def reduce_multiplicity(receiving_items):
    reduced_dict = dict()
    reduced_list = list()
    for item in receiving_items:
        id = item.get('product_id').id
        if id not in reduced_dict:
            reduced_list.append(item)
            reduced_dict[id] = len(reduced_list)-1
        else:
            reduced_list[reduced_dict[id]]['quantity'] = reduced_list[reduced_dict[id]]['quantity'] + item.get('quantity')
    return reduced_list



class ReceivingPackageRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceivingPackage
        fields = ['webshop_id', 'track_id', 'comment']

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