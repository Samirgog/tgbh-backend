// src/modules/user/entities/user.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars'; // Убедитесь, что graphql-scalars установлен
import { StoreEntity } from '../../store/entities/store.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@ObjectType('User') // Явно указываем имя типа для GraphQL, если хотим использовать 'User'
export class UserEntity {
  // Изменим имя класса, чтобы избежать конфликта с возможным импортом Prisma User
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLBigInt)
  telegramId: bigint;

  @Field({ nullable: true })
  username?: string; // В TypeScript это string | undefined

  @Field({ nullable: true })
  firstName?: string; // В TypeScript это string | undefined

  @Field({ nullable: true })
  lastName?: string; // В TypeScript это string | undefined

  @Field({ nullable: true })
  avatarUrl?: string; // В TypeScript это string | undefined

  @Field({ nullable: true })
  isBot?: boolean;

  @Field({ nullable: true })
  telegramAuthDate?: number;

  @Field({ nullable: true })
  telegramHash?: string;

  @Field(() => String)
  role: UserRole;

  @Field(() => [StoreEntity], { nullable: true })
  ownedStores?: StoreEntity[];

  @Field(() => [StoreEntity], { nullable: true })
  employeeAt?: StoreEntity[];

  @Field(() => [OrderEntity], { nullable: true })
  orders?: OrderEntity[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
