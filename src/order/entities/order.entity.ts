import { ObjectType, Field, ID } from '@nestjs/graphql';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusHistoryEntity } from './order-status-history.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { StoreEntity } from '../../store/entities/store.entity';

@ObjectType('Order')
export class OrderEntity {
  @Field(() => ID)
  id: string;

  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => StoreEntity)
  store: StoreEntity;

  @Field(() => [OrderItemEntity])
  items: OrderItemEntity[];

  @Field(() => [OrderStatusHistoryEntity])
  statusHistory: OrderStatusHistoryEntity[];

  @Field()
  totalAmount: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
