import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../../common/dto/base.dto';
import {
  PaymentType,
  PaymentCondition,
  ReceiveWay,
  OrderStatus,
} from '@prisma/client';
import {
  ObjectType,
  InputType,
  Field,
  Float,
  ID,
  registerEnumType,
} from '@nestjs/graphql';

registerEnumType(PaymentType, { name: 'PaymentType' });
registerEnumType(PaymentCondition, { name: 'PaymentCondition' });
registerEnumType(ReceiveWay, { name: 'ReceiveWay' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType()
export class OrderItemDto {
  @Field(() => ID)
  @IsString()
  productId: string;

  @Field(() => Float)
  @IsNumber()
  quantity: number;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedParameterIds?: string[];
}

@InputType()
export class OrderItemParameterDto {
  @Field()
  @IsString()
  text: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  priceAmount?: number;
}

@ObjectType()
export class OrderItemParameterResponseDto {
  @Field()
  text: string;

  @Field(() => Float, { nullable: true })
  priceAmount?: number;
}

@InputType()
export class CreateOrderItemDto {
  @Field(() => ID)
  productId: string;

  @Field()
  productName: string;

  @Field({ nullable: true })
  productDescription?: string;

  @Field({ nullable: true })
  productImageUrl?: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => [OrderItemParameterDto], { nullable: true })
  selectedParameters?: OrderItemParameterDto[];
}

@InputType()
export class CreateOrderDto extends BaseDto {
  @Field(() => ID)
  @IsString()
  storeId: string;

  @Field(() => ID)
  @IsString()
  customerId: string;

  @Field(() => PaymentType)
  @IsEnum(PaymentType)
  chosenPaymentType: PaymentType;

  @Field(() => PaymentCondition)
  @IsEnum(PaymentCondition)
  chosenPaymentCondition: PaymentCondition;

  @Field(() => ReceiveWay)
  @IsEnum(ReceiveWay)
  chosenReceiveWay: ReceiveWay;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLatitude()
  deliveryLat?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLongitude()
  deliveryLon?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  customerPhoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customerName?: string;

  @Field(() => [OrderItemDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

@InputType()
export class UpdateOrderDto extends BaseDto {
  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLatitude()
  deliveryLat?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLongitude()
  deliveryLon?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  customerPhoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customerName?: string;
}

@ObjectType()
export class OrderItemResponseDto {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  productId: string;

  @Field(() => ID, { nullable: true })
  productSnapshotId?: string;

  @Field()
  productName: string;

  @Field({ nullable: true })
  productDescription?: string;

  @Field({ nullable: true })
  productImageUrl?: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => [OrderItemParameterResponseDto], { nullable: true })
  selectedParameters?: OrderItemParameterResponseDto[];
}

@ObjectType()
export class OrderStatusHistoryResponseDto {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field()
  changedAt: Date;

  @Field({ nullable: true })
  notes?: string;
}

@ObjectType()
export class OrderResponseDto extends BaseDto {
  @Field()
  shortId: string;

  @Field(() => ID)
  storeId: string;

  @Field(() => ID)
  customerId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  currency: string;

  @Field(() => PaymentType)
  chosenPaymentType: PaymentType;

  @Field(() => PaymentCondition)
  chosenPaymentCondition: PaymentCondition;

  @Field(() => ReceiveWay)
  chosenReceiveWay: ReceiveWay;

  @Field({ nullable: true })
  deliveryAddress?: string;

  @Field(() => Float, { nullable: true })
  deliveryLat?: number;

  @Field(() => Float, { nullable: true })
  deliveryLon?: number;

  @Field({ nullable: true })
  customerPhoneNumber?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field(() => [OrderItemResponseDto])
  items: OrderItemResponseDto[];

  @Field(() => [OrderStatusHistoryResponseDto])
  statusHistory: OrderStatusHistoryResponseDto[];
}
