import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductInput } from './dto/create-product.input';
import { CategoryService } from '../category/services/category.service';
import { ProductService } from '../product/services/product.service';
import { CategoryResponseDto } from '../category/dto/category.dto';
import { ProductResponseDto } from '../product/dto/product.dto';

@Injectable()
export class CatalogService {
  constructor(
    private prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  async createCategory(data: {
    storeId: string;
    name: string;
    priority?: number;
    imageUrl?: string;
    imageName?: string;
  }) {
    const { storeId, ...rest } = data;
    return this.prisma.category.create({
      data: {
        ...rest,
        store: {
          connect: { id: storeId },
        },
      },
    });
  }

  getCategoriesByStoreId(storeId: string) {
    return this.prisma.category.findMany({
      where: { storeId },
      orderBy: { priority: 'asc' },
      include: {
        products: { include: { parameters: true } },
      },
    });
  }

  async createProduct(
    categoryId: string,
    input: CreateProductInput,
  ): Promise<Product> {
    const {
      parameters,
      priceAmount,
      priceCurrency,
      imageUrl,
      imageName,
      ...rest
    } = input;

    const product = await this.prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        priceAmount: priceAmount ?? 0, // или выбрасывай ошибку, если обязательное
        priceCurrency: priceCurrency ?? 'RUB', // значение по умолчанию
        imageUrl: imageUrl ?? null,
        imageName: imageName ?? null,
      },
    });

    if (parameters?.length) {
      await this.prisma.productParameter.createMany({
        data: parameters.map((p) => ({
          text: p.text,
          priceAmount: p.priceAmount ?? 0,
          productId: product.id,
        })),
      });
    }

    const foundProduct = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: { parameters: true },
    });

    if (!foundProduct) {
      throw new NotFoundException('Product not found after creation');
    }

    return foundProduct;
  }

  getProductsByCategoryId(categoryId: string) {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: { parameters: true },
    });
  }

  async getFullCatalog(storeId: string): Promise<{
    categories: (CategoryResponseDto & { products: ProductResponseDto[] })[];
  }> {
    const categories = await this.categoryService.findByStoreId(storeId);
    
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        if (!category.id) {
          throw new Error('Category id is missing');
        }
        const products = await this.productService.findByCategoryId(category.id);
        return {
          ...category,
          products,
        };
      }),
    );

    return {
      categories: categoriesWithProducts,
    };
  }

  async getActiveCatalog(storeId: string): Promise<{
    categories: (CategoryResponseDto & { products: ProductResponseDto[] })[];
  }> {
    const categories = await this.categoryService.findByStoreId(storeId);
    
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        if (!category.id) {
          throw new Error('Category id is missing');
        }
        const products = await this.productService.findActiveByCategoryId(category.id);
        return {
          ...category,
          products,
        };
      }),
    );

    return {
      categories: categoriesWithProducts,
    };
  }
}
