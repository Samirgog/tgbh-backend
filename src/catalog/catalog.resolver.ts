import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CatalogService } from './catalog.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { CreateProductInput } from './dto/create-product.input';

@Resolver()
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Mutation(() => CategoryEntity)
  createCategory(@Args('data') data: CreateCategoryInput) {
    return this.catalogService.createCategory(data);
  }

  @Query(() => [CategoryEntity])
  getCategoriesByStore(@Args('storeId', { type: () => ID }) storeId: string) {
    return this.catalogService.getCategoriesByStoreId(storeId);
  }

  @Mutation(() => ProductEntity)
  createProduct(
    @Args('categoryId', { type: () => ID }) categoryId: string,
    @Args('data') data: CreateProductInput,
  ) {
    return this.catalogService.createProduct(categoryId, data);
  }

  @Query(() => [ProductEntity])
  getProductsByCategory(
    @Args('categoryId', { type: () => ID }) categoryId: string,
  ) {
    return this.catalogService.getProductsByCategoryId(categoryId);
  }

  @Query(() => [CategoryEntity])
  async getFullCatalog(@Args('storeId', { type: () => ID }) storeId: string) {
    const catalog = await this.catalogService.getFullCatalog(storeId);
    return catalog.categories;
  }

  @Query(() => [CategoryEntity])
  async getActiveCatalog(@Args('storeId', { type: () => ID }) storeId: string) {
    const catalog = await this.catalogService.getActiveCatalog(storeId);
    return catalog.categories;
  }
}
