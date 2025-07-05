import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../../common/dto/base.dto';
import { Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductParameterResponseDto {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field(() => Float, { nullable: true })
  priceAmount?: number;
}

@ObjectType()
export class ProductResponseDto extends BaseDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  imageName?: string;

  @Field(() => Float)
  priceAmount: number;

  @Field()
  priceCurrency: string;

  @Field()
  isActive: boolean;

  @Field(() => ID)
  categoryId: string;

  @Field(() => [ProductParameterResponseDto])
  parameters: ProductParameterResponseDto[];
}

@InputType()
export class ProductParameterDto {
  @Field()
  @IsString()
  text: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceAmount?: number;
}

@InputType()
export class CreateProductDto extends BaseDto {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageName?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  priceAmount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  priceCurrency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => [ProductParameterDto], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductParameterDto)
  parameters?: ProductParameterDto[];
}

@InputType()
export class UpdateProductDto extends BaseDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

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
  @Min(0)
  priceAmount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  priceCurrency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => [ProductParameterDto], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductParameterDto)
  parameters?: ProductParameterDto[];
}
