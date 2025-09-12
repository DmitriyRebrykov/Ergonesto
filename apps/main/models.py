from django.db import models
from django.utils.text import slugify
from enum import Enum

class Color(Enum):
    BLACK = 'Чорний'
    BROWN = 'Коричневий'
    WHITE = 'Білий'

    @classmethod
    def choices(cls):
        return [(c.value,c.value)for c in cls]

class ModuleMaterial(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Material"
        verbose_name_plural = "Materials"
        db_table = 'material_module'

class ProductType(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Product type"
        verbose_name_plural = "Product types"
        db_table = 'product_type'

class Product(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    frame_color = models.CharField(max_length=100, blank=True, null=True, help_text='ONLY FOR FOOTREST', choices=Color.choices())
    stand_color = models.CharField(max_length=100, blank=True, null=True, help_text='ONLY FOR FOOTREST', choices=Color.choices())
    main_image = models.ImageField(upload_to='product/main/')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    type = models.ForeignKey(ProductType, on_delete=models.CASCADE, related_name='products')
    module_material = models.ForeignKey(ModuleMaterial, on_delete=models.CASCADE, blank=True, null=True, help_text='ONLY FOR MODULE')

    def __str__(self):
        return f'{self.name}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        db_table = 'product'

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/extra/')