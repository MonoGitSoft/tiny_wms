from django.contrib import admin

from .models import *

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'barcode', 'item_number', 'quantity', 'webshop_name', 'description', 'notification_num', 'weight', 'size']

    def webshop_name(self, obj):
        return obj.webshop_id.name
    webshop_name.short_description = 'Webshop'
    webshop_name.admin_order_field = 'webshop_name'

admin.site.register(Product, ProductAdmin)

admin.site.register([WebShop, RackLocation, ProductLoction, ReceivingPackage, ReceivingItems])

# Register your models here.
