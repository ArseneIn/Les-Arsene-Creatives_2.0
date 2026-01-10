import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../entities/sale.entity';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  async getLiabilityStatus(merchantId: string) {
    const threshold = 20000000; // 20M RWF
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Calculate turnover for the last 12 months
    const sales = await this.salesRepository.find({
      where: {
        merchant_id: merchantId,
        created_at: Between(oneYearAgo, today),
      },
    });

    const turnoverYTD = sales.reduce(
      (sum, sale) => sum + Number(sale.total),
      0,
    );

    let status: 'SAFE' | 'WARNING' | 'LIABLE' = 'SAFE';
    let warningMessage =
      'Your turnover is below the VAT registration threshold.';

    if (turnoverYTD >= threshold) {
      status = 'LIABLE';
      warningMessage =
        'You have exceeded the VAT registration threshold. You are required to register for VAT.';
    } else if (turnoverYTD >= threshold * 0.8) {
      status = 'WARNING';
      warningMessage =
        'You are approaching the VAT registration threshold (80%). Prepare to register soon.';
    }

    return {
      turnoverYTD,
      threshold,
      status,
      warningMessage,
    };
  }
}
