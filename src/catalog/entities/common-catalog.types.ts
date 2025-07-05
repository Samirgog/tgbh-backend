import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType('Price')
export class PriceEntity {
  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  currency?: string;
}

@ObjectType('CatalogImage') // Renamed to avoid conflict if other Image types exist
export class CatalogImageEntity {
  @Field({ nullable: true })
  url?: string | null;

  @Field({ nullable: true })
  name?: string;
}
