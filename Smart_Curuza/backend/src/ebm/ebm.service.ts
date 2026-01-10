import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { Merchant } from '../entities/merchant.entity';

@Injectable()
export class EbmService {
  private readonly logger = new Logger(EbmService.name);

  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  async initialize(merchantId: string) {
    this.logger.log(`Initializing EBM for merchant ${merchantId}`);
    // TODO: Implement actual RRA initialization logic
    return { status: 'initialized', message: 'EBM Initialized (Mock)' };
  }

  async fetchCodes() {
    this.logger.log('Fetching RRA Item Class Codes and Tax Types');
    // TODO: Call RRA API to get codes
    // Returning mock data for now
    return {
      itemClassCodes: [
        { code: '12345', name: 'General Goods' },
        { code: '67890', name: 'Food Stuffs' },
      ],
      taxTypes: [
        { code: 'A', rate: 18, name: 'Standard Rated' },
        { code: 'B', rate: 0, name: 'Exempt' },
      ],
    };
  }

  async submitSale(saleId: string) {
    this.logger.log(`Submitting sale ${saleId} to RRA`);
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['merchant'],
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // TODO: Construct RRA payload and send to API

    // Update sync status
    sale.sync_status = 'COMPLETED'; // or 'FAILED'
    await this.saleRepository.save(sale);

    return { status: 'success', rra_receipt_number: `RRA-${Date.now()}` };
  }
}
