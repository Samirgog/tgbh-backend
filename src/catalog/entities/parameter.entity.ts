import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('ProductParameter')
export class ProductParameterEntity {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field(() => Float, { nullable: true })
  priceAmount?: number;
}
