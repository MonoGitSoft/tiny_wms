from .models import WebShop
from .serializers import WebShopSerializer
from rest_framework import generics

class WebShopListCreate(generics.ListCreateAPIView):
    queryset = WebShop.objects.all()
    serializer_class = WebShopSerializer

# Create your views here.
