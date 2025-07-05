import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByTelegramId(telegramId: bigint): Promise<User | null> {
    return this.findFirst({ telegramId });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findFirst({ username });
  }

  async findWithStores(id: string): Promise<User | null> {
    return this.findUnique(
      { id },
      {
        include: {
          ownedStores: true,
          employeeAt: {
            include: {
              store: true,
            },
          },
        },
      },
    );
  }

  async findWithOrders(id: string): Promise<User | null> {
    return this.findUnique(
      { id },
      {
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
              statusHistory: true,
            },
          },
        },
      },
    );
  }

  async findWithAllDetails(id: string): Promise<User | null> {
    return this.findUnique(
      { id },
      {
        include: {
          ownedStores: true,
          employeeAt: {
            include: {
              store: true,
            },
          },
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
              statusHistory: true,
            },
          },
        },
      },
    );
  }
}
