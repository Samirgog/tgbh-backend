import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../../common/dto/base.dto';
import { StoreResponseDto } from '../../store/dto/store.dto';
import { OrderResponseDto } from '../../order/dto/order.dto';
import {ObjectType, Field, ID, Int, InputType} from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { UserRole } from '../../common/enums/user-role.enum';

@InputType()
export class CreateUserDto {
  @Field(() => Int)
  @IsNumber()
  telegramId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isBot?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  telegramAuthDate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telegramHash?: string;
}

export class UpdateUserDto extends BaseDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isBot?: boolean;
}

@ObjectType()
export class UserResponseDto {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLBigInt)
  telegramId: bigint;

  @Field(() => String, { nullable: true })
  username: string | null;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;

  @Field(() => Boolean, { nullable: true })
  isBot: boolean;

  @Field(() => String)
  role: UserRole;

  @Field(() => Number, { nullable: true })
  telegramAuthDate: number | null;

  @Field(() => String, { nullable: true })
  telegramHash: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreResponseDto)
  ownedStores?: StoreResponseDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreResponseDto)
  employeeAt?: StoreResponseDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderResponseDto)
  orders?: OrderResponseDto[];
}
