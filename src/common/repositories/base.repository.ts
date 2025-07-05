import { PrismaService } from '../../prisma/prisma.service';
import { BaseDto } from '../dto/base.dto';

export abstract class BaseRepository<T extends BaseDto> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: string,
  ) {}

  async findMany(where: any, include?: any): Promise<T[]> {
    return this.prisma[this.model].findMany({
      where,
      include,
    });
  }

  async findFirst(where: any, include?: any): Promise<T | null> {
    return this.prisma[this.model].findFirst({
      where,
      include,
    });
  }

  async findUnique(where: any, include?: any): Promise<T | null> {
    return this.prisma[this.model].findUnique({
      where,
      include,
    });
  }

  async create(data: any, include?: any): Promise<T> {
    return this.prisma[this.model].create({
      data,
      include,
    });
  }

  async update(where: any, data: any, include?: any): Promise<T> {
    return this.prisma[this.model].update({
      where,
      data,
      include,
    });
  }

  async delete(where: any): Promise<T> {
    return this.prisma[this.model].delete({
      where,
    });
  }

  async count(where: any): Promise<number> {
    return this.prisma[this.model].count({
      where,
    });
  }

  async aggregate(aggregate: any): Promise<any> {
    return this.prisma[this.model].aggregate(aggregate);
  }

  async groupBy(groupBy: any, having?: any): Promise<any> {
    return this.prisma[this.model].groupBy({
      by: groupBy,
      having,
    });
  }
}
