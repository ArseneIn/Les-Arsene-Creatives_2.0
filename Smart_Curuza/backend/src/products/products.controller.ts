import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: any): Promise<any[]> {
    return this.productsService.findAll(user.merchantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() productData: Partial<Product>,
    @CurrentUser() user: any,
  ): Promise<Product> {
    // Automatically set merchant_id from the authenticated user
    if (user && user.merchantId) {
      productData.merchant_id = user.merchantId;
    }
    return this.productsService.create(productData);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, productData);
  }
}
