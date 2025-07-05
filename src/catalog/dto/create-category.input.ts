import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  storeId: string;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  priority?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  imageName?: string;
}
