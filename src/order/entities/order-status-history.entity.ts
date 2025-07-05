import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';

@ObjectType('OrderStatusHistory')
export class OrderStatusHistoryEntity {
  @Field(() => ID)
  id: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => UserEntity, { nullable: true })
  updatedBy?: UserEntity;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
