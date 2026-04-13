import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';

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
    const allSubs = await this.subscriptionsRepository.find({
      order: { createdAt: 'DESC' },
    });

    // Calculate Total Revenue (Sum of 'amount')
    const totalRevenue = allSubs.reduce(
      (acc, sub) => acc + Number(sub.amount),
      0,
    );

    // Calculate MRR (Monthly Recurring Revenue)
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

    // Calculate Trends (Last 6 Months)
    const trends: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthLabel = format(monthDate, 'MMM');

      // Group subs by plan for this month
      // logic: A sub counts for a month if its createdAt falls within that month
      const monthSubs = allSubs.filter((sub) => {
        const subDate = new Date(sub.createdAt);
        return isWithinInterval(subDate, {
          start: monthStart,
          end: monthEnd,
        });
      });

      const planBreakdown: Record<string, number> = {};
      monthSubs.forEach((sub) => {
        const planName = sub.plan || 'Other';
        planBreakdown[planName] =
          (planBreakdown[planName] || 0) + Number(sub.amount);
      });

      trends.push({
        name: monthLabel,
        ...planBreakdown,
        total: monthSubs.reduce((sum, sub) => sum + Number(sub.amount), 0),
      });
    }

    return {
      totalRevenue,
      mrr,
      activeSubscriptions,
      churnRate,
      recentTransactions: allSubs.slice(0, 5),
      trends,
    };
  }
}
