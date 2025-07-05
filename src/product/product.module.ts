import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
