from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from rest_framework import generics
from .models import *


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
