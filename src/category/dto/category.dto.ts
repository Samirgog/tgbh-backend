import {
  IsString,
  IsOptional,
  IsNumber,
  Min, IsDate,
} from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';
import { ProductResponseDto } from '../../product/dto/product.dto';
import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Type} from "class-transformer";

@ObjectType()
export class CreateCategoryDto extends BaseDto{
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageName?: string;
}

@ObjectType()
export class UpdateCategoryDto extends BaseDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageName?: string;
}

@ObjectType()
export class CategoryResponseDto extends BaseDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  priority: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageName?: string;

  @Field()
  @IsString()
  storeId: string;

  @Field(() => [ProductResponseDto], { nullable: true })
  products: ProductResponseDto[];
}
