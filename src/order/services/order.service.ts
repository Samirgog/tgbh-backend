import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderResponseDto,
  CreateOrderItemDto,
} from '../dto/order.dto';
import { Order, OrderStatus } from '@prisma/client';
import { StoreService } from '../../store/services/store.service';
import { UserService } from '../../user/services/user.service';
import { ProductService } from '../../product/services/product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly storeService: StoreService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const store = await this.storeService.findOne(createOrderDto.storeId);
    if (!store) {
      throw new NotFoundException(
        `Store with ID ${createOrderDto.storeId} not found`,
      );
    }

    const customer = await this.userService.findOne(createOrderDto.customerId);
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createOrderDto.customerId} not found`,
      );
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems: CreateOrderItemDto[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not active`);
      }

      const itemTotal = product.priceAmount * item.quantity;
      totalAmount += itemTotal;

      const orderItem: CreateOrderItemDto = {
        productId: product.id as string,
        productName: product.name,
        productDescription: product.description || undefined,
        productImageUrl: product.imageUrl || undefined,
        quantity: item.quantity,
        unitPrice: product.priceAmount,
        totalPrice: itemTotal,
        selectedParameters: item.selectedParameterIds?.map((paramId) => {
          const param = product.parameters.find((p) => p.id === paramId);
          if (!param) {
            throw new BadRequestException(
              `Parameter with ID ${paramId} not found`,
            );
          }
          return {
            text: param.text,
            priceAmount: param.priceAmount || undefined,
          };
        }),
      };

      orderItems.push(orderItem);
    }

    const order = await this.orderRepository.create({
      ...createOrderDto,
      totalAmount,
      status: OrderStatus.PENDING_CONFIRMATION,
      items: {
        create: orderItems,
      },
      statusHistory: {
        create: {
          status: OrderStatus.PENDING_CONFIRMATION,
        },
      },
    });

    return this.mapToResponseDto(order);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findMany({});
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findWithDetails(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.mapToResponseDto(order);
  }

  async findByShortId(shortId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findByShortId(shortId);
    if (!order) {
      throw new NotFoundException(`Order with short ID ${shortId} not found`);
    }
    return this.mapToResponseDto(order);
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.update({ id }, updateOrderDto);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.mapToResponseDto(order);
  }

  async remove(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.delete({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.mapToResponseDto(order);
  }

  async findByStoreId(storeId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByStoreId(storeId);
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findByCustomerId(customerId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByCustomerId(customerId);
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findByStatus(status: OrderStatus): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByStatus(status);
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findByStoreIdAndStatus(
    storeId: string,
    status: OrderStatus,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByStoreIdAndStatus(
      storeId,
      status,
    );
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findByCustomerIdAndStatus(
    customerId: string,
    status: OrderStatus,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByCustomerIdAndStatus(
      customerId,
      status,
    );
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    notes?: string,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findUnique({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updatedOrder = await this.orderRepository.update(
      { id },
      {
        status,
        statusHistory: {
          create: {
            status,
            notes,
          },
        },
      },
    );

    return this.mapToResponseDto(updatedOrder);
  }

  private mapToResponseDto(
    order: Order & {
      items?: any[];
      statusHistory?: any[];
    },
  ): OrderResponseDto {
    return {
      id: order.id,
      shortId: order.shortId,
      storeId: order.storeId,
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      chosenPaymentType: order.chosenPaymentType,
      chosenPaymentCondition: order.chosenPaymentCondition,
      chosenReceiveWay: order.chosenReceiveWay,
      deliveryAddress: order.deliveryAddress || undefined,
      deliveryLat: order.deliveryLat || undefined,
      deliveryLon: order.deliveryLon || undefined,
      customerPhoneNumber: order.customerPhoneNumber || undefined,
      customerName: order.customerName || undefined,
      items:
        order.items?.map((item) => ({
          id: item.id,
          productId: item.productId,
          productSnapshotId: item.productSnapshotId || undefined,
          productName: item.productName,
          productDescription: item.productDescription || undefined,
          productImageUrl: item.productImageUrl || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          selectedParameters: item.selectedParameters as {
            text: string;
            priceAmount?: number;
          }[],
        })) || [],
      statusHistory:
        order.statusHistory?.map((history) => ({
          id: history.id,
          status: history.status,
          changedAt: history.changedAt,
          notes: history.notes || undefined,
        })) || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
