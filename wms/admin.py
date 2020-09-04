from django.contrib import admin

from .models import *

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'barcode', 'item_number', 'quantity', 'webshop_name', 'description', 'notification_num', 'weight', 'size']

    def webshop_name(self, obj):
        return obj.webshop_id.name
    webshop_name.short_description = 'Webshop'
    webshop_name.admin_order_field = 'webshop_name'

class RackLoctionAdmin(admin.ModelAdmin):
    list_display = ['barcode', 'num_product_type']
    def num_product_type(self, obj):
        return obj.products.all().count()


class ProductLocationAdmin(admin.ModelAdmin):
    list_display = ['product', 'rack', 'product_quantity', 'barcode']

    def barcode(self, obj):
        return obj.product.barcode


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductLoction, ProductLocationAdmin)
admin.site.register(RackLocation, RackLoctionAdmin)
admin.site.register([WebShop, ReceivingPackage, ReceivingItems])

# Register your models here.
