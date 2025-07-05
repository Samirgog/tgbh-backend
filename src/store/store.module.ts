import { Module, forwardRef } from '@nestjs/common';
import { StoreService } from './services/store.service';
import { StoreRepository } from './repositories/store.repository';
import { StoreResolver } from './store.resolver';
// import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module'; // For UserService in resolver
import { CategoryModule } from '../category/category.module'; // For CategoryService in resolver
import { ProductModule } from '../product/product.module'; // For ProductService in resolver
import { OrderModule } from '../order/order.module'; // For OrderService in resolver

@Module({
  imports: [
    // forwardRef(() => AuthModule), // If AuthModule needs StoreService (e.g. for store-specific roles)
    UserModule, // To inject UserService for resolving owner
    forwardRef(() => CategoryModule), // To inject CategoryService
    forwardRef(() => ProductModule), // To inject ProductService
    forwardRef(() => OrderModule), // To inject OrderService
  ],
  providers: [StoreService, StoreRepository, StoreResolver],
  exports: [StoreService],
})
export class StoreModule {}
