from django.contrib import admin
from .models import Product, Color, Material, ProductVariant, Inventory, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 2

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'product_type', 'is_active', 'main_image', 'description', 'slug', 'created_at', 'updated_at']
    list_filter = ['product_type', 'is_active']
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ['name']
    inlines = [ProductImageInline]
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'product_type', 'is_active', 'main_image', 'description', 'slug')
        }),
        ('Время', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ['name', 'hex_color']
    search_fields = ['name']

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['name', 'category']
    list_filter = ['category']
    search_fields = ['name']

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'color', 'material', 'sku', 'price']
    list_filter = ['product__product_type', 'is_active']
    search_fields = ['sku', 'product__name']

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['variant', 'quantity_on_hand', 'quantity_reserved']
    search_fields = ['variant__sku']