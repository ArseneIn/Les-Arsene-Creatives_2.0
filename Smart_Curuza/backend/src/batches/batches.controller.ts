import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { Batch } from '../entities/batch.entity';

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get(':productId')
  async getActiveBatches(
    @Param('productId') productId: string,
  ): Promise<Batch[]> {
    return this.batchesService.findActiveBatches(productId);
  }

  @Post()
  async createBatch(@Body() batchData: Partial<Batch>): Promise<Batch> {
    // Generate a batch number if not provided
    if (!batchData.batch_number) {
      batchData.batch_number = `B-${Date.now()}`;
    }
    return this.batchesService.createBatch(batchData);
  }
}
