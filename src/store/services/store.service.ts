import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StoreRepository } from '../repositories/store.repository';
import {
  StoreResponseDto,
} from '../dto/store.dto';
import {
  Store,
  StoreStatus,
  PaymentType,
  PaymentCondition,
  ReceiveWay,
} from '@prisma/client';
import { UserService } from '../../user/services/user.service';
import {CreateStoreInput} from "../dto/create-store.input";
import {UpdateStoreInput} from "../dto/update-store.input";
import {CategoryResponseDto} from "../../category/dto/category.dto";

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly userService: UserService,
  ) {}

  async create(
    ownerId: string,
    createStoreDto: CreateStoreInput,
  ): Promise<StoreResponseDto> {
    const user = await this.userService.findOne(ownerId);
    if (!user) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    const store = await this.storeRepository.create({
      ...createStoreDto,
      ownerId,
      status: StoreStatus.DRAFT,
    });

    return await this.mapToResponseDto(store);
  }

  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.storeRepository.findMany(
      {},
      {
        paymentMethods: true,
        paymentConditions: true,
        deliveryMethods: true,
      },
    );
    return Promise.all(stores.map((store) => this.mapToResponseDto(store)));
  }

  async findOne(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findUnique(
      { id },
      {
        paymentMethods: true,
        paymentConditions: true,
        deliveryMethods: true,
        categories: true
      },
    );
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return await this.mapToResponseDto(store);
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreInput,
  ): Promise<StoreResponseDto> {
    const store = await this.storeRepository.update({ id }, updateStoreDto, {
      paymentMethods: true,
      paymentConditions: true,
      deliveryMethods: true,
      categories: {
        include: {
          products: {
            include: {
              parameters: true
            }
          }
        }
      }
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return await this.mapToResponseDto(store);
  }

  async remove(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.delete({ id });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return await this.mapToResponseDto(store);
  }

  async findByOwnerId(ownerId: string): Promise<StoreResponseDto[]> {
    const stores = await this.storeRepository.findByOwnerId(ownerId);
    return Promise.all(stores.map((store) => this.mapToResponseDto(store)));
  }

  async findWithDetails(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findWithDetails(id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return await this.mapToResponseDto(store);
  }

  async publish(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findWithDetails(id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.status !== StoreStatus.DRAFT) {
      throw new BadRequestException('Only draft stores can be published');
    }

    const updatedStore = await this.storeRepository.update(
      { id },
      { status: StoreStatus.PENDING_MODERATION },
      { paymentMethods: true, paymentConditions: true, deliveryMethods: true },
    );

    return await this.mapToResponseDto(updatedStore);
  }

  async approve(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findUnique(
      { id },
      {
        paymentMethods: true,
        paymentConditions: true,
        deliveryMethods: true,
      },
    );
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.status !== StoreStatus.PENDING_MODERATION) {
      throw new BadRequestException(
        'Only stores pending moderation can be approved',
      );
    }

    const updatedStore = await this.storeRepository.update(
      { id },
      { status: StoreStatus.PUBLISHED },
      { paymentMethods: true, paymentConditions: true, deliveryMethods: true },
    );

    return await this.mapToResponseDto(updatedStore);
  }

  async reject(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findUnique(
      { id },
      {
        paymentMethods: true,
        paymentConditions: true,
        deliveryMethods: true,
      },
    );
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.status !== StoreStatus.PENDING_MODERATION) {
      throw new BadRequestException(
        'Only stores pending moderation can be rejected',
      );
    }

    const updatedStore = await this.storeRepository.update(
      { id },
      { status: StoreStatus.REJECTED },
      { paymentMethods: true, paymentConditions: true, deliveryMethods: true },
    );

    return await this.mapToResponseDto(updatedStore);
  }

  async archive(id: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findUnique(
      { id },
      {
        paymentMethods: true,
        paymentConditions: true,
        deliveryMethods: true,
      },
    );
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    if (store.status === StoreStatus.ARCHIVED) {
      throw new BadRequestException('Store is already archived');
    }

    const updatedStore = await this.storeRepository.update(
      { id },
      { status: StoreStatus.ARCHIVED },
      { paymentMethods: true, paymentConditions: true, deliveryMethods: true },
    );

    return await this.mapToResponseDto(updatedStore);
  }

  private async mapToResponseDto(
    store: Store & {
      paymentMethods?: { type: PaymentType }[];
      paymentConditions?: { condition: PaymentCondition }[];
      deliveryMethods?: { receiveWay: ReceiveWay }[];
      categories?: CategoryResponseDto[]
    },
  ): Promise<StoreResponseDto> {
    const owner = await this.userService.findOne(store.ownerId);
    return {
      id: store.id,
      name: store.name,
      description: store.description,
      bannerUrl: store.bannerUrl || undefined,
      bannerName: store.bannerName || undefined,
      theme: store.theme || undefined,
      status: store.status,
      owner: owner,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      paymentMethods: store.paymentMethods?.map(pm => ({ ...pm, isEnabled: true })) || [],
      paymentConditions: store.paymentConditions?.map(pc => ({ ...pc, isEnabled: true })) || [],
      deliveryMethods: store.deliveryMethods?.map(dm => ({ ...dm, isEnabled: true })) || [],
      categories: store.categories ?? []
    };
  }
}
