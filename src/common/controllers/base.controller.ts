import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BaseService } from '../services/base.service';
import { BaseDto } from '../dto/base.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../decorators/roles.decorator';

@Controller()
export abstract class BaseController<T extends BaseDto> {
  constructor(
    protected readonly service: BaseService<T>,
    protected readonly route: string,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: any): Promise<T[]> {
    return this.service.findMany(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<T | null> {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createDto: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<T> {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<T> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<T> {
    return this.service.delete(id);
  }
}
