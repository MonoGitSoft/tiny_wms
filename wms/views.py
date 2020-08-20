from .models import WebShop
from .serializers import *
from rest_framework import generics

class WebShopListCreate(generics.ListCreateAPIView):
    queryset = WebShop.objects.all()
    serializer_class = WebShopSerializer

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class RackLocationListCreate(generics.ListCreateAPIView):
    queryset = RackLocation.objects.all()
    serializer_class = RackSerializer
# Create your views here.
