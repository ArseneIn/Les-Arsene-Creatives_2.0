import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = this.subscriptionsRepository.create({
      ...createSubscriptionDto,
      status: 'Active', // Default to active on creation
    });
    return this.subscriptionsRepository.save(subscription);
  }

  async findAll() {
    return this.subscriptionsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getStats() {
    const allSubs = await this.subscriptionsRepository.find();

    // Calculate Total Revenue (Sum of 'amount')
    const totalRevenue = allSubs.reduce(
      (acc, sub) => acc + Number(sub.amount),
      0,
    );

    // Calculate MRR (Monthly Recurring Revenue)
    // For Yearly, divide by 12. For Monthly, take as is. (Simplified logic)
    const mrr = allSubs.reduce((acc, sub) => {
      if (sub.status !== 'Active') return acc;
      return (
        acc +
        (sub.billingCycle === 'Yearly'
          ? Number(sub.amount) / 12
          : Number(sub.amount))
      );
    }, 0);

    const activeSubscriptions = allSubs.filter(
      (s) => s.status === 'Active',
    ).length;
    const churnRate = 0; // Placeholder for now

    return {
      totalRevenue,
      mrr,
      activeSubscriptions,
      churnRate,
      recentTransactions: allSubs.slice(0, 5),
    };
  }
}
