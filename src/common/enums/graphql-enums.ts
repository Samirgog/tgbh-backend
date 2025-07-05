import { registerEnumType } from '@nestjs/graphql';
import {
  PaymentType,
  PaymentCondition,
  ReceiveWay,
  StoreStatus,
  OrderStatus,
} from '@prisma/client';

export { PaymentType, PaymentCondition, ReceiveWay, StoreStatus, OrderStatus };

registerEnumType(PaymentType, { name: 'PaymentType' });
registerEnumType(PaymentCondition, { name: 'PaymentCondition' });
registerEnumType(ReceiveWay, { name: 'ReceiveWay' });
registerEnumType(StoreStatus, { name: 'StoreStatus' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });
