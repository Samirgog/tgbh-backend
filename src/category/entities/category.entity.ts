import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StoreEntity } from '../../store/entities/store.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@ObjectType('Category')
export class CategoryEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  priority: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  imageName?: string;

  @Field(() => StoreEntity)
  store: StoreEntity;

  @Field(() => [ProductEntity], { nullable: true })
  products?: ProductEntity[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
