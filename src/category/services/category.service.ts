import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from '../dto/category.dto';
import { Category } from '@prisma/client';
import { StoreService } from '../../store/services/store.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly storeService: StoreService,
  ) {}

  async create(
    storeId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const store = await this.storeService.findOne(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const category = await this.categoryRepository.create({
      ...createCategoryDto,
      storeId,
    });

    return this.mapToResponseDto(category);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findMany({});
    return categories.map((category) => this.mapToResponseDto(category));
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findUnique({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.update(
      { id },
      updateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async remove(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.delete({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async findByStoreId(storeId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findByStoreId(storeId);
    return categories.map((category) => this.mapToResponseDto(category));
  }

  async findWithProducts(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findWithProducts(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async updateImage(
    id: string,
    imageUrl: string,
    imageName: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findUnique({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const updatedCategory = await this.categoryRepository.update(
      { id },
      { imageUrl, imageName },
    );

    return this.mapToResponseDto(updatedCategory);
  }

  async removeImage(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findUnique({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const updatedCategory = await this.categoryRepository.update(
      { id },
      { imageUrl: null, imageName: null },
    );

    return this.mapToResponseDto(updatedCategory);
  }

  private mapToResponseDto(
    category: Category & { products?: any[] },
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      priority: category.priority,
      imageUrl: category.imageUrl || undefined,
      imageName: category.imageName || undefined,
      storeId: category.storeId,
      products:
        category.products?.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || undefined,
          imageUrl: product.imageUrl || undefined,
          imageName: product.imageName || undefined,
          priceAmount: product.priceAmount,
          priceCurrency: product.priceCurrency,
          isActive: product.isActive,
          categoryId: product.categoryId,
          parameters:
            product.parameters?.map((param) => ({
              id: param.id,
              text: param.text,
              priceAmount: param.priceAmount || undefined,
            })) || [],
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })) || [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
