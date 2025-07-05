import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity'; // Импортируем наш UserEntity
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/user.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Resolver(() => UserEntity) // Указываем, что этот резолвер для GraphQL типа User (представленного классом UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity, { name: 'userWithStores', nullable: true })
  async getUserWithStores(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findWithStores(id);
    return user ? this.mapToEntity(user) : null;
  }

  @Mutation(() => UserEntity)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userService.create(createUserDto);
    return this.mapToEntity(user);
  }

  @Mutation(() => UserEntity)
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserEntity> {
    const user = await this.userService.remove(id);
    return this.mapToEntity(user);
  }

  private mapToEntity(user: any): UserEntity {
    return {
      id: user.id,
      telegramId: BigInt(user.telegramId),
      username: user.username ?? undefined,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      isBot: user.isBot,
      ownedStores: user.ownedStores,
      employeeAt: user.employeeAt,
      orders: user.orders,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role ?? UserRole.CUSTOMER,
    };
  }
}
