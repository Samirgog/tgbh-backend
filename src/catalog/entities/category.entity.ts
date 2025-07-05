import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ProductEntity } from './product.entity';
import { CatalogImageEntity } from './common-catalog.types';

@ObjectType('Category')
export class CategoryEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  priority: number;

  @Field(() => CatalogImageEntity, { nullable: true })
  image?: CatalogImageEntity;

  @Field(() => [ProductEntity], { nullable: 'itemsAndList' })
  products?: ProductEntity[]; // This will be resolved by a field resolver

  // Add other fields like createdAt, updatedAt if they are part of your GQL Category type
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
