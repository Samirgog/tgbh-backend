import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Category } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'category');
  }

  async findByStoreId(storeId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { storeId },
      orderBy: {
        priority: 'asc',
      },
    });
  }

  async findWithProducts(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }
}
