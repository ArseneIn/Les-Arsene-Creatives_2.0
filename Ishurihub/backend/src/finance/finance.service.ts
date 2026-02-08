import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) { }

  create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  findAll(schoolId: string) {
    return this.paymentsRepository.find({
      where: { schoolId },
      order: { date: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.paymentsRepository.findOneBy({ id });
  }

  async getMonthlyStats(schoolId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .where('payment.schoolId = :schoolId', { schoolId })
      .andWhere('payment.date >= :start', { start: startOfMonth.toISOString().split('T')[0] })
      .andWhere('payment.date <= :end', { end: endOfMonth.toISOString().split('T')[0] })
      .getMany();

    const revenue = payments
      .filter((p) => p.type === 'Income' || !p.type) // Default to income if not specified (adjust based on entity)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Assuming we might have expense logic later or different transaction types
    // For now simple sum

    return {
      revenue,
      expenses: 0, // Placeholder
      net: revenue
    };
  }

  remove(id: string) {
    return this.paymentsRepository.delete(id);
  }
}
