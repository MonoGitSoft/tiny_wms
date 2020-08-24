from django.contrib import admin

from .models import *

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'barcode', 'item_number', 'quantity', 'get_webshop_name', 'description', 'notification_num', 'weight', 'size']

    def get_webshop_name(self, obj):
        return obj.webshop_id.name
    get_webshop_name.short_description = 'Webshop'
    get_webshop_name.admin_order_field = 'get_webshop_name'

admin.site.register(Product, ProductAdmin)

admin.site.register([WebShop, RackLocation, ProductLoction])

# Register your models here.
