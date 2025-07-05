import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Category, Product } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'category');
  }

  async findByStoreId(storeId: string): Promise<Category[]> {
    return this.findMany({ storeId });
  }

  async findWithProducts(id: string): Promise<Category | null> {
    return this.findUnique(
      { id },
      {
        include: {
          products: {
            include: {
              parameters: true,
            },
          },
        },
      },
    );
  }
}

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    return this.findMany({ categoryId });
  }

  async findActiveByCategoryId(categoryId: string): Promise<Product[]> {
    return this.findMany({ categoryId, isActive: true });
  }

  async findWithParameters(id: string): Promise<Product | null> {
    return this.findUnique(
      { id },
      {
        include: {
          parameters: true,
        },
      },
    );
  }
}
