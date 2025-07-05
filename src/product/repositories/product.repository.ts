import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Product } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: {
        parameters: true,
      },
    });
  }

  async findActiveByCategoryId(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        parameters: true,
      },
    });
  }

  async findWithParameters(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        parameters: true,
      },
    });
  }
}
