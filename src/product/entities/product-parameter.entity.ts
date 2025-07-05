import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('ProductParameter')
export class ProductParameterEntity {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  priceAmount?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
