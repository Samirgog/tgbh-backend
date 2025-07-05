import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProductEntity } from '../../product/entities/product.entity';

@ObjectType('OrderItem')
export class OrderItemEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ProductEntity)
  product: ProductEntity;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field()
  totalPrice: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
