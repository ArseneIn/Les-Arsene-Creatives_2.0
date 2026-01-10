import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(data: Partial<Expense>) {
    const expense = this.expensesRepository.create(data);
    return this.expensesRepository.save(expense);
  }

  async findAll(merchantId: string, startDate?: string, endDate?: string) {
    const where: any = { merchant_id: merchantId };
    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    }
    return this.expensesRepository.find({
      where,
      order: { date: 'DESC' },
      relations: ['user'],
    });
  }

  async delete(id: string) {
    return this.expensesRepository.delete(id);
  }

  async getSummary(merchantId: string, startDate: string, endDate: string) {
    const expenses = await this.findAll(merchantId, startDate, endDate);
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    return { total, byCategory };
  }
}
