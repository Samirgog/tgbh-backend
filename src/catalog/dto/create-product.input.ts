import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { CreateParameterInput } from './create-parameter.input';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProductInput {
  // @Field(() => ID)
  // @IsNotEmpty()
  // categoryId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  imageName?: string;

  @Field(() => Float, { nullable: true })
  priceAmount?: number;

  @Field({ nullable: true })
  priceCurrency?: string;

  @Field({ defaultValue: true })
  isActive: boolean;

  @Field(() => [CreateParameterInput], { nullable: 'itemsAndList' })
  parameters?: CreateParameterInput[];
}
