import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../dto/product.dto';
import { Product, ProductParameter } from '@prisma/client';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    categoryId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const category = await this.categoryService.findOne(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const product = await this.productRepository.create({
      ...createProductDto,
      categoryId,
    });

    return this.mapToResponseDto(product);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findMany({});
    return products.map((product) => this.mapToResponseDto(product));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findUnique({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.update(
      { id },
      updateProductDto,
    );
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async remove(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.delete({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async findByCategoryId(categoryId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByCategoryId(categoryId);
    return products.map((product) => this.mapToResponseDto(product));
  }

  async findActiveByCategoryId(
    categoryId: string,
  ): Promise<ProductResponseDto[]> {
    const products =
      await this.productRepository.findActiveByCategoryId(categoryId);
    return products.map((product) => this.mapToResponseDto(product));
  }

  async updateImage(
    id: string,
    imageUrl: string,
    imageName: string,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findUnique({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = await this.productRepository.update(
      { id },
      { imageUrl, imageName },
    );

    return this.mapToResponseDto(updatedProduct);
  }

  async removeImage(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findUnique({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = await this.productRepository.update(
      { id },
      { imageUrl: null, imageName: null },
    );

    return this.mapToResponseDto(updatedProduct);
  }

  async activate(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findUnique({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.isActive) {
      throw new BadRequestException('Product is already active');
    }

    const updatedProduct = await this.productRepository.update(
      { id },
      { isActive: true },
    );

    return this.mapToResponseDto(updatedProduct);
  }

  async deactivate(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findUnique({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is already inactive');
    }

    const updatedProduct = await this.productRepository.update(
      { id },
      { isActive: false },
    );

    return this.mapToResponseDto(updatedProduct);
  }

  private mapToResponseDto(
    product: Product & { parameters?: ProductParameter[] },
  ): ProductResponseDto {
    return {
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
    };
  }
}
