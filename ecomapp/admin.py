from django.contrib import admin
from .models import *



class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'category', 'image', 'marked_price', 'selling_price', 'description', 'warranty', 'return_policy', 'view_count']

admin.site.register(Product,ProductAdmin)

class CustomerAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'address', 'joined_on']

admin.site.register(Customer,CustomerAdmin)



admin.site.register(
    [Admin, Category, Cart, CartProduct, Order, ProductImage])
