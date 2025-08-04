import {InputType, Field, Float, ID} from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class StoreThemeInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  background?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  accent?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardBackground?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cardBorder?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  general?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secondary?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  white?: string;
}

@InputType()
class StorePaymentMethodInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  condition?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

@InputType()
class StorePaymentConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  condition?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

@InputType()
class StoreDeliveryMethodInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  receiveWay: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  details?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

@InputType()
class ProductParameterInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  text: string;

  @Field()
  @IsString()
  priceAmount: number;
}

@InputType()
class ProductInput {
  @Field(() => ID, {nullable: true})
  @IsOptional()
  id?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  priceAmount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageName?: string;

  @Field(() => [ProductParameterInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductParameterInput)
  parameters?: ProductParameterInput[];
}

@InputType()
class CategoryInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  id?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageName?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @Field(() => [ProductInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductInput)
  products?: ProductInput[];
}

@InputType()
export class CreateStoreInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;


  @Field({ nullable: true })
  @IsOptional()
  bannerUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bannerName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  theme?: string;

  @Field(() => [StorePaymentMethodInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StorePaymentMethodInput)
  paymentMethods?: StorePaymentMethodInput[];

  @Field(() => [StorePaymentConditionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StorePaymentConditionInput)
  paymentConditions?: StorePaymentConditionInput[];

  @Field(() => [StoreDeliveryMethodInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreDeliveryMethodInput)
  deliveryMethods?: StoreDeliveryMethodInput[];

  @Field(() => [CategoryInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryInput)
  categories: CategoryInput[];
}
