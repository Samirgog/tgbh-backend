import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Order, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'order');
  }

  async findByStoreId(storeId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { storeId },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { status },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findByStoreIdAndStatus(
    storeId: string,
    status: OrderStatus,
  ): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { storeId, status },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findByCustomerIdAndStatus(
    customerId: string,
    status: OrderStatus,
  ): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { customerId, status },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findByShortId(shortId: string): Promise<Order | null> {
    return this.prisma.order.findFirst({
      where: { shortId },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findWithDetails(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findWithItems(id: string): Promise<Order | null> {
    return this.findUnique(
      { id },
      {
        include: {
          items: true,
        },
      },
    );
  }

  async findWithStatusHistory(id: string): Promise<Order | null> {
    return this.findUnique(
      { id },
      {
        include: {
          statusHistory: true,
        },
      },
    );
  }

  async findActiveByStoreId(storeId: string): Promise<Order[]> {
    return this.findMany({
      storeId,
      status: {
        in: [
          OrderStatus.PENDING_PAYMENT,
          OrderStatus.PENDING_CONFIRMATION,
          OrderStatus.CONFIRMED,
          OrderStatus.PREPARING,
          OrderStatus.READY_FOR_PICKUP,
          OrderStatus.OUT_FOR_DELIVERY,
        ],
      },
    });
  }
}
