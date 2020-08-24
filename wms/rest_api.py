from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import *
from .models import *


@api_view(['GET', 'POST'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def webshops_list(request):
    """
    List all webshop, or create a new one with validation
    """
    if request.method == 'GET':
        queryset = WebShop.objects.all()
        serializer = WebShopSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializers = WebShopSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def webshops_detail(request, pk):
    try:
        webshop = WebShop.objects.get(pk=pk)
    except Exception as e:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializers = WebShopSerializer(webshop)
        return Response(serializers.data)

@api_view(['POST'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def items(request):
    if request.method == 'POST':
        serializers = ProductSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

