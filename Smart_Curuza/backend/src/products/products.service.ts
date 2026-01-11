import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { BatchesService } from '../batches/batches.service';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private batchesService: BatchesService,
    private notificationsService: NotificationsService,
  ) { }

  async findAll(merchantId?: string): Promise<any[]> {
    const whereClause = merchantId ? { merchant_id: merchantId } : {};
    const products = await this.productsRepository.find({
      where: whereClause,
      relations: ['batches'],
      order: { name: 'ASC' },
    });

    return products.map((product) => {
      const activeBatches =
        product.batches?.filter((b) => b.status === 'active') || [];
      const totalValue = activeBatches.reduce((sum, batch) => {
        return (
          sum +
          Number(batch.current_quantity) * Number(batch.buying_price_per_unit)
        );
      }, 0);

      return {
        ...product,
        total_stock_value: totalValue,
        // Optional: Ensure stock matches batches (source of truth)
        stock: activeBatches.reduce(
          (sum, b) => sum + Number(b.current_quantity),
          0,
        ),
      };
    });
  }

  async create(
    productData: Partial<Product> & { conversion_factor?: number },
  ): Promise<Product> {
    const newProduct = this.productsRepository.create(productData);
    const savedProduct = await this.productsRepository.save(newProduct);

    // Create initial batch if stock is provided
    if (savedProduct.stock > 0) {
      await this.batchesService.createBatch(
        {
          product_id: savedProduct.id,
          batch_number: `INIT-${Date.now()}`,
          original_quantity: savedProduct.stock,
          current_quantity: savedProduct.stock,
          buying_price_per_unit: savedProduct.cost_price,
          selling_price: savedProduct.price,
          total_cost: savedProduct.cost_price * savedProduct.stock,
          status: 'active',
        },
        false,
      );
    }

    await this.notificationsService.create({
      title: 'Product Created',
      message: `New product "${savedProduct.name}" added to inventory.`,
      type: 'info',
    });

    return savedProduct;
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, updateData);
    const updatedProduct = await this.findOne(id);
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.notificationsService.create({
      title: 'Product Updated',
      message: `Product "${updatedProduct.name}" details updated.`,
      type: 'info',
    });

    return updatedProduct;
  }
}
