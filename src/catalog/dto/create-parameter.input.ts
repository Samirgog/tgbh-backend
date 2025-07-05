import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateParameterInput {
  @Field()
  text: string;

  @Field(() => Float, { nullable: true })
  priceAmount?: number;
}
