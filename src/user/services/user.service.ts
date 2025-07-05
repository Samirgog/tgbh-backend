import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { User } from '@prisma/client';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.create(createUserDto);
    return this.mapToResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findMany({});
    return users.map((user) => this.mapToResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findUnique({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.update({ id }, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.delete({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findByTelegramId(telegramId: bigint): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByTelegramId(telegramId);
    return user ? this.mapToResponseDto(user) : null;
  }

  async findByUsername(username: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByUsername(username);
    return user ? this.mapToResponseDto(user) : null;
  }

  async findWithStores(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findWithStores(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findWithOrders(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findWithOrders(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findWithAllDetails(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findWithAllDetails(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  private mapToResponseDto(
    user: User & {
      ownedStores?: any[];
      employeeAt?: any[];
      orders?: any[];
    },
  ): UserResponseDto {
    let role = UserRole.CUSTOMER;
    if (user.ownedStores && user.ownedStores.length > 0) {
      role = UserRole.STORE_OWNER;
    } else if (user.employeeAt && user.employeeAt.length > 0) {
      role = UserRole.EMPLOYEE;
    }

    return {
      id: user.id,
      telegramId: BigInt(user.telegramId),
      username: user.username || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      avatarUrl: user.avatarUrl || null,
      isBot: user.isBot,
      telegramAuthDate: user.telegramAuthDate || null,
      telegramHash: user.telegramHash || null,
      role,
      ownedStores: user.ownedStores,
      employeeAt: user.employeeAt?.map((employee) => employee.store),
      orders: user.orders,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
