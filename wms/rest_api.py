from django.db.models import Count
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response

from django_react_wms.settings import MAX_TYPE_PRODUCT_IN_SECTIO
from .serializers import *
from .models import *
from django_react_wms import settings

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
def get_take_in_box(request):
    if 'barcode' not in request.data:
        return Response(['Barcode is missing!!!'], status=status.HTTP_400_BAD_REQUEST)
    try:
        take_in_box = RackLocation.objects.get(barcode=request.data['barcode'])
        serializer = TakeInRackSerializer(take_in_box)
        return Response(serializer.data)
    except Exception as e:
        return Response(str(e), status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,)) #TODO set correct perrmisions
def check_take_in(request):
    """
        Check that you could put the given box's content to one of the rack section or you have to split up the box
        content two smaller box.
    """
    if 'barcode' not in request.data:
        return Response(['Barcode is missing!!!'], status=status.HTTP_400_BAD_REQUEST)
    try:
        take_in_box = RackLocation.objects.get(barcode=request.data['barcode'])
        fit_racks = RackLocation.objects.filter(rack_type=RackLocation.RACK)
        only_racks =  RackLocation.objects.filter(rack_type=RackLocation.RACK)
        num_products_type_in_take_in_box = take_in_box.products.all().count()
        for product in take_in_box.products.all():
            fit_racks = fit_racks.exclude(products__barcode=product.barcode) | only_racks.filter(products__id=product.id)

        fit_racks = fit_racks.annotate(num_products_type=Count('products')).exclude(num_products_type__gte=(MAX_TYPE_PRODUCT_IN_SECTIO - num_products_type_in_take_in_box))

        if len(fit_racks) != 0:
            return Response(status=status.HTTP_202_ACCEPTED)
        else:
            return Response(['There is no free space for that take_in box,'
                             ' please split the number of product type in the taken in box (put the half of the product type to an other take in box)'], status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(str(e), status=status.HTTP_404_NOT_FOUND)

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
def set_incoming_package(request):
    print(request.data)
    if not request.data['take_in_box_barcode']:
        return Response(['Take_in box barcode is missing'], status=status.HTTP_400_BAD_REQUEST)
    if 'is_take_in_finished' not in request.data.keys():
        return Response(['is_take_in_finished param is missing'], status=status.HTTP_400_BAD_REQUEST)

    try:
        take_in_box = RackLocation.objects.get(barcode=request.data['take_in_box_barcode'], rack_type=RackLocation.TAKE_IN_RACK)
        print( take_in_box.fullness_percentage)
        if take_in_box.fullness_percentage == 100:
            return Response(['This package take-in box already full choose an other one'], status=status.HTTP_400_BAD_REQUEST)
        receiving_pack = ReceivingPackage.objects.get(id=request.data['receiving_package_id'])
        if receiving_pack.status != ReceivingPackage.SHIPPING:
            print(receiving_pack.status)
            return Response(["This package already take-in!!!"], status=status.HTTP_400_BAD_REQUEST)
        print(receiving_pack)
    except Exception as e:
        print("Not found")
        return Response(str(e), status=status.HTTP_404_NOT_FOUND)
    serializer = ReceivingPackageUpdateSerializer(receiving_pack, data=request.data)
    if serializer.is_valid():
        rec_pack = serializer.save()
        if request.data['is_take_in_finished']:
            rec_pack.status = ReceivingPackage.TAKEN_OVER # bevéteéezve

        for rec_item in receiving_pack.items.all():
            print("ok")
            take_in_box.fullness_percentage = 100
            take_in_box.save()
            loc = ProductLoction(product=rec_item.product_id, rack=take_in_box, product_quantity=rec_item.received_quantity)
            product = Product.objects.get(id=rec_item.product_id.id)
            product.quantity = product.quantity + rec_item.received_quantity
            product.save()
            loc.save()
        rec_pack.save()
        print("ok")
        return Response()
    else:
        print("not valued")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
    queryset = ReceivingPackage.objects.filter(status=ReceivingPackage.SHIPPING)
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