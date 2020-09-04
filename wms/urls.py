from django.urls import path
from . import views
from . import rest_api

urlpatterns = [
    path('api/wms/', views.WebShopListCreate.as_view()),
    path('webshops/', rest_api.webshops_list),
    path('webshops/<int:pk>/', rest_api.webshops_detail),
    path('items/', rest_api.create_item),
    path('items/<int:wb_pk>', rest_api.get_webshop_items),
    path('items_details/', rest_api.get_items_details),
    path('inventory/receiving_package/', rest_api.create_receiving_package),
    path('inventory/receiving_package/all/', rest_api.get_receiving_packages),
    path('inventory/receiving_package/<track_id>', rest_api.get_receiving_package),
    path('inventory/incoming_package/', rest_api.set_incoming_package),
    path('inventory/putaway/check/', rest_api.check_take_in),
    path('inventory/putaway/', rest_api.get_take_in_box)
    #path('inventory/receiving_items/<int:package_id>', rest_api.get_receiving_items),
]