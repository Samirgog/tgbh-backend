import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderRepository } from './repositories/order.repository';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    forwardRef(() => StoreModule),
    UserModule,
    forwardRef(() => ProductModule)
  ],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
