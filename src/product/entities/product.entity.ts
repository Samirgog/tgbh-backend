import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CategoryEntity } from '../../category/entities/category.entity';
import { StoreEntity } from '../../store/entities/store.entity';
import { ProductParameterEntity } from './product-parameter.entity';

@ObjectType('Product')
export class ProductEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  priceAmount: number;

  @Field()
  priceCurrency: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  imageName?: string;

  @Field()
  isActive: boolean;

  @Field(() => StoreEntity)
  store: StoreEntity;

  @Field(() => CategoryEntity)
  category: CategoryEntity;

  @Field(() => [ProductParameterEntity], { nullable: true })
  parameters?: ProductParameterEntity[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
