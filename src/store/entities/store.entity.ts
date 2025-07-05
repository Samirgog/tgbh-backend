// src/modules/store/entities/store.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { StoreStatus as PrismaStoreStatus } from '@prisma/client';
import {
  PaymentType,
  PaymentCondition,
  ReceiveWay,
  StoreStatus,
} from '../../common/enums/graphql-enums';

// No need for registerEnumType here if it's done in common/graphql-enums.ts

@ObjectType('StoreTheme')
export class StoreThemeEntity {
  @Field({ nullable: true, defaultValue: '#FFFFFF' })
  background?: string;

  @Field({ nullable: true, defaultValue: '#6200EE' })
  accent?: string;

  @Field({ nullable: true, defaultValue: '#F5F5F5' })
  cardBackground?: string;

  @Field({ nullable: true, defaultValue: '#E0E0E0' })
  cardBorder?: string;

  @Field({ nullable: true })
  general?: string;

  @Field({ nullable: true })
  secondary?: string;

  @Field({ nullable: true, defaultValue: '#FFFFFF' })
  white?: string;
}

@ObjectType('StorePaymentMethodConfig')
export class StorePaymentMethodConfigEntity {
  @Field(() => ID)
  id: string;

  @Field(() => PaymentType)
  type: PaymentType;

  @Field(() => PaymentCondition)
  condition: PaymentCondition;

  @Field()
  isEnabled: boolean;
}

@ObjectType('StoreDeliveryMethodConfig')
export class StoreDeliveryMethodConfigEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ReceiveWay)
  receiveWay: ReceiveWay;

  @Field({ nullable: true })
  details?: string;

  @Field()
  isEnabled: boolean;
}

@ObjectType('Store')
export class StoreEntity {
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

  @Field(() => StoreStatus)
  status: StoreStatus;

  @Field({ nullable: true })
  theme?: string;

  @Field(() => UserEntity)
  owner: UserEntity;

  @Field(() => [CategoryEntity], { nullable: 'itemsAndList' })
  categories?: CategoryEntity[];

  @Field(() => [StorePaymentMethodConfigEntity], { nullable: 'itemsAndList' })
  paymentMethods?: StorePaymentMethodConfigEntity[];

  @Field(() => [StoreDeliveryMethodConfigEntity], { nullable: 'itemsAndList' })
  deliveryMethods?: StoreDeliveryMethodConfigEntity[];

  @Field(() => [UserEntity], { nullable: 'itemsAndList' })
  employees?: UserEntity[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
