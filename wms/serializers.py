from rest_framework import serializers
from .models import WebShop

class WebShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebShop
        fields = ('id', 'name', 'url', 'email')