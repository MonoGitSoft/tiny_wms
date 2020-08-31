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
        product = ProductSerializer(data=request.data)
        if product.is_valid():
            product.save()
            return Response(product.data, status=status.HTTP_201_CREATED)
    return Response(product.errors, status=status.HTTP_400_BAD_REQUEST)


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
def get_items_details(request):
    """
        JSON Array product_id -> JSON Array product details

    """
    queries = list()
    for item in request.data["items"]:
        try:
            query = Product.objects.get(id=item["product_id"])
        except Exception as e:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        queries.append( ProductSerializer(query).data)

    return JsonResponse(queries, safe=False, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def create_receiving_package(request):
    """
        Egy webshoptol bevételezendő csomagot hoz létre.
    """
    serializers_pck = ReceivingPackageSerializer(data=request.data)
    if request.method == 'POST':
        if serializers_pck.is_valid():
            serializers_pck.save()
            return Response(serializers_pck.data)
        else:
            return Response(serializers_pck.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def get_receiving_packages(request):
    queryset = ReceivingPackage.objects.all()
    rec_pkg = ReceivingPackageSerializer(queryset, many=True)
    return Response(rec_pkg.data)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def get_receiving_package(request, track_id):
    """
        A bevételezendő csimagot adja vissza track_id alapjan
    """
    try:
        package = ReceivingPackage.objects.get(track_id=track_id)
    except Exception as e:
        return JsonResponse({'status_code': 404,'error': 'The resource was not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        package_response = ReceivingPackageSerializer(package)
        return Response(package_response.data)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def get_receiving_items(request, package_id):
    try:
        queryset = ReceivingItems.objects.filter(package_id=package_id)
    except Exception as e:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    serializer = ReceivingItemsSerializer(queryset, many=True)
    if request.method == 'GET':
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)