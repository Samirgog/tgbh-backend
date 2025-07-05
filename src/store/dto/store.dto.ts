import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import {
  PaymentType,
  PaymentCondition,
  ReceiveWay,
  StoreStatus,
} from '@prisma/client';
import { UserResponseDto } from '../../user/dto/user.dto';
import { CategoryResponseDto } from '../../category/dto/category.dto';
import { OrderResponseDto } from '../../order/dto/order.dto';
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class StoreThemeDto {
  @Field({nullable: true})
  @IsOptional()
  @IsString()
  background?: string;

  @Field({nullable: true})
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

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  secondary?: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  white?: string;
}

@ObjectType()
export class StorePaymentMethodConfigDto {
  @Field()
  @IsEnum(PaymentType)
  type: PaymentType;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@ObjectType()
export class StorePaymentConditionConfigDto {
  @Field()
  @IsEnum(PaymentCondition)
  condition: PaymentCondition;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@ObjectType()
export class StoreDeliveryMethodConfigDto {
  @Field()
  @IsEnum(ReceiveWay)
  receiveWay: ReceiveWay;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  details?: string;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}

@ObjectType()
export class StoreResponseDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  bannerUrl?: string;

  @Field({ nullable: true })
  bannerName?: string;

  @Field({ nullable: true })
  theme?: string;

  @Field(() => StoreStatus)
  status: StoreStatus;

  @Field(() => [StorePaymentMethodConfigDto])
  paymentMethods: StorePaymentMethodConfigDto[];

  @Field(() => [StorePaymentConditionConfigDto])
  paymentConditions: StorePaymentConditionConfigDto[];

  @Field(() => [StoreDeliveryMethodConfigDto])
  deliveryMethods: StoreDeliveryMethodConfigDto[];

  @Field(() => UserResponseDto)
  owner: UserResponseDto;

  @Field(() => [CategoryResponseDto], { nullable: true })
  categories?: CategoryResponseDto[];

  @Field(() => [UserResponseDto], { nullable: true })
  employees?: UserResponseDto[];

  @Field(() => [OrderResponseDto], { nullable: true })
  orders?: OrderResponseDto[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}