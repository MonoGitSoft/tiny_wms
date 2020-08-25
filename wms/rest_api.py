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
def create_item(request):
    if request.method == 'POST':
        serializers = ProductSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def get_webshop_items(request, wb_pk):
    if request.method == 'GET':
        queryset = Product.objects.filter(webshop_id=wb_pk)
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)
    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def create_receiving_package(request):
    """
        Egy webshoptol bevételezendő csomagot hoz létre.
    """
    errors = list();
    serializers_pck = ReceivingPackageSerializer(data=request.data)
    saved_receoving_package = ''
    if request.method == 'POST':
        print()
        if serializers_pck.is_valid():
            saved_receoving_package = serializers_pck.save()
            print("GIGGAIGAIGIA DCOAKSDK")
            #return Response(serializers_pck.data, status=status.HTTP_201_CREATED)
        else:
            print("Kurvanbagy asd")
            print(serializers_pck.errors)
        print(request.data["receiving_products"])

        for product in request.data["receiving_products"]:
            serializers_products = ReceivingItemsSerializer(data=product)
            if serializers_products.is_valid():
                print('Valide')
                saved_receoving_package.receivingitems_set.create(product_id=Product.objects.get(id=product["product_id"]), quantity=product["quantity"])
            else:
                print('Error :')
                print(serializers_products.errors)
                errors.extend(serializers_products.errors)

    errors.extend(serializers_pck.errors)
    return Response(serializers_pck.data, status=status.HTTP_201_CREATED)