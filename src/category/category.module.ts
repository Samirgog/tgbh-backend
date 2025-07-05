import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [forwardRef(() => StoreModule)],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
