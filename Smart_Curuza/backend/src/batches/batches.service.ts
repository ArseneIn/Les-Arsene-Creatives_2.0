import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Batch } from '../entities/batch.entity';
import { Product } from '../entities/product.entity';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private batchesRepository: Repository<Batch>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private notificationsService: NotificationsService,
  ) {}

  async createBatch(
    data: Partial<Batch>,
    updateProductStock: boolean = true,
  ): Promise<Batch> {
    const batch = this.batchesRepository.create(data);
    const savedBatch = await this.batchesRepository.save(batch);

    // Update Product Stock
    if (updateProductStock && data.product_id) {
      const product = await this.productRepository.findOne({
        where: { id: data.product_id },
      });
      if (product) {
        const oldStock = Number(product.stock);
        product.stock = oldStock + Number(savedBatch.current_quantity);

        // Auto-activate if it was out of stock
        if (oldStock <= 0 && product.stock > 0) {
          product.status = 'active';
        }

        await this.productRepository.save(product);

        // Notification
        await this.notificationsService.create({
          title: 'Stock Added',
          message: `Added ${savedBatch.current_quantity} units to "${product.name}". New stock: ${product.stock}.`,
          type: 'success',
        });
      }
    }

    return savedBatch;
  }

  async findActiveBatches(productId: string): Promise<Batch[]> {
    return this.batchesRepository.find({
      where: { product_id: productId },
      order: { created_at: 'DESC' }, // Show newest first
    });
  }

  async updateBatch(
    id: string,
    updates: Partial<Batch>,
  ): Promise<Batch | null> {
    await this.batchesRepository.update(id, updates);
    return this.batchesRepository.findOne({ where: { id } });
  }

  async deductStock(
    productId: string,
    quantity: number,
    manager: EntityManager,
    preferredBatchId?: string,
  ): Promise<{ batchId: string; quantity: number; costPrice: number }[]> {
    let remainingQuantity = quantity;
    const usage: { batchId: string; quantity: number; costPrice: number }[] =
      [];

    let whereCondition: any = { product_id: productId, status: 'active' };

    // If a specific batch is requested, try to use it first (or exclusively? Let's say exclusively for now to respect the choice)
    // However, if the user just "prefers" it, maybe we should fall back?
    // For now, if a batch ID is sent, we filter by it. If it's not enough, we might error or fall back.
    // Let's assume strict selection if provided, as that's safer for "choosing" a batch.
    if (preferredBatchId) {
      whereCondition.id = preferredBatchId;
    }

    const batches = await manager.find(Batch, {
      where: whereCondition,
      order: { created_at: 'ASC' },
    });

    for (const batch of batches) {
      if (remainingQuantity <= 0) break;

      // Ensure current_quantity is treated as a number
      const currentQty = Number(batch.current_quantity);
      let usedQty = 0;

      if (currentQty >= remainingQuantity) {
        usedQty = remainingQuantity;
        batch.current_quantity = currentQty - remainingQuantity;
        remainingQuantity = 0;
      } else {
        usedQty = currentQty;
        remainingQuantity -= currentQty;
        batch.current_quantity = 0;
        batch.status = 'depleted';
      }

      usage.push({
        batchId: batch.id,
        quantity: usedQty,
        costPrice: Number(batch.buying_price_per_unit),
      });

      await manager.save(batch);
    }

    if (remainingQuantity > 0) {
      throw new Error(`Insufficient stock in batches for product ${productId}`);
    }

    return usage;
  }
}
