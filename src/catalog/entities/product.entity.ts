import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProductParameterEntity } from './parameter.entity';
import { PriceEntity, CatalogImageEntity } from './common-catalog.types';
// Forward declaration for CategoryEntity to handle circular dependency if Product refers back to Category directly
// For now, Category will be resolved via field resolver if Product needs it.

@ObjectType('Product')
export class ProductEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => CatalogImageEntity, { nullable: true })
  image?: CatalogImageEntity;

  @Field(() => PriceEntity, { nullable: true })
  price?: PriceEntity;

  @Field()
  isActive: boolean;

  // category: CategoryEntity; // This would be handled by a field resolver

  @Field(() => [ProductParameterEntity], { nullable: 'itemsAndList' })
  parameters?: ProductParameterEntity[];

  // Add other fields like createdAt, updatedAt if they are part of your GQL Product type
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
