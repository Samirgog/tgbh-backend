import { PrismaService } from '../../prisma/prisma.service';
import { BaseDto } from '../dto/base.dto';

export abstract class BaseService<T extends BaseDto> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: string,
  ) {}

  async findAll(): Promise<T[]> {
    return this.prisma[this.model].findMany();
  }

  async findOne(id: string): Promise<T | null> {
    return this.prisma[this.model].findUnique({
      where: { id },
    });
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.prisma[this.model].create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<T> {
    return this.prisma[this.model].update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.prisma[this.model].delete({
      where: { id },
    });
  }

  async findMany(where: any): Promise<T[]> {
    return this.prisma[this.model].findMany({
      where,
    });
  }

  async findFirst(where: any): Promise<T | null> {
    return this.prisma[this.model].findFirst({
      where,
    });
  }
}
