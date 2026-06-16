import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class UpdateBillingDto {
  plan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
  maxStudents?: number;
}

export class UpdatePlanConfigDto {
  price?: number;
  maxStudents?: number;
  features?: string[];
}

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async ensurePlansSeeded() {
    const count = await this.prisma.planConfiguration.count();
    if (count === 0) {
      const defaults = [
        {
          plan: SubscriptionPlan.FREE,
          name: 'Free',
          price: 0,
          maxStudents: 50,
          features: [
            'Real-time WPM Tracker',
            'Basic Analytics',
            '1 Facilitator',
            'Up to 50 Students',
          ],
        },
        {
          plan: SubscriptionPlan.STARTER,
          name: 'Starter',
          price: 49,
          maxStudents: 100,
          features: [
            'Real-time WPM Tracker',
            'Detailed Student Analytics',
            'Up to 2 Facilitators',
            'Up to 100 Students',
            'Email Support',
          ],
        },
        {
          plan: SubscriptionPlan.PROFESSIONAL,
          name: 'Professional',
          price: 149,
          maxStudents: 500,
          features: [
            'Everything in Starter',
            'Up to 10 Facilitators',
            'Up to 500 Students',
            'CSV Bulk Student Import',
            'Custom Typing Tests',
            'Priority Support',
          ],
        },
        {
          plan: SubscriptionPlan.ENTERPRISE,
          name: 'Enterprise',
          price: 499,
          maxStudents: 5000,
          features: [
            'Everything in Professional',
            'Custom Student Seat Limits',
            'Unlimited Facilitators',
            'Advanced Platform Settings',
            'Dedicated Database Option',
            'SLA & 24/7 Support',
          ],
        },
      ];

      for (const d of defaults) {
        await this.prisma.planConfiguration.create({ data: d });
      }
    }
  }

  async getAllBilling() {
    await this.ensurePlansSeeded();
    const institutions = await this.prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        contactEmail: true,
        plan: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        maxStudents: true,
        createdAt: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return institutions.map((inst) => ({
      ...inst,
      totalUsers: inst._count.users,
    }));
  }

  async updateBilling(institutionId: string, dto: UpdateBillingDto) {
    return this.prisma.institution.update({
      where: { id: institutionId },
      data: {
        ...(dto.plan !== undefined && { plan: dto.plan }),
        ...(dto.subscriptionStatus !== undefined && {
          subscriptionStatus: dto.subscriptionStatus,
        }),
        ...(dto.subscriptionStartDate !== undefined && {
          subscriptionStartDate: dto.subscriptionStartDate
            ? new Date(dto.subscriptionStartDate)
            : null,
        }),
        ...(dto.subscriptionEndDate !== undefined && {
          subscriptionEndDate: dto.subscriptionEndDate
            ? new Date(dto.subscriptionEndDate)
            : null,
        }),
        ...(dto.maxStudents !== undefined && { maxStudents: dto.maxStudents }),
      },
      select: {
        id: true,
        name: true,
        plan: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        maxStudents: true,
      },
    });
  }

  async getPlanConfigurations() {
    await this.ensurePlansSeeded();
    return this.prisma.planConfiguration.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async updatePlanConfiguration(plan: SubscriptionPlan, dto: UpdatePlanConfigDto) {
    await this.ensurePlansSeeded();
    return this.prisma.planConfiguration.update({
      where: { plan },
      data: {
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.maxStudents !== undefined && { maxStudents: dto.maxStudents }),
        ...(dto.features !== undefined && { features: dto.features }),
      },
    });
  }

  async getBillingStats() {
    await this.ensurePlansSeeded();
    const [institutions, planConfigs] = await Promise.all([
      this.prisma.institution.findMany({
        select: {
          plan: true,
          subscriptionStatus: true,
          maxStudents: true,
          _count: { select: { users: true } },
        },
      }),
      this.prisma.planConfiguration.findMany(),
    ]);

    const planPrices: Record<string, number> = {};
    planConfigs.forEach((pc) => {
      planPrices[pc.plan] = pc.price;
    });

    const totalMRR = institutions.reduce((sum, inst) => {
      if (inst.subscriptionStatus === 'ACTIVE') {
        return sum + (planPrices[inst.plan] ?? 0);
      }
      return sum;
    }, 0);

    const planCounts: Record<string, number> = {
      FREE: 0,
      STARTER: 0,
      PROFESSIONAL: 0,
      ENTERPRISE: 0,
    };
    const statusCounts: Record<string, number> = {
      TRIAL: 0,
      ACTIVE: 0,
      SUSPENDED: 0,
      EXPIRED: 0,
    };

    institutions.forEach((inst) => {
      planCounts[inst.plan] = (planCounts[inst.plan] || 0) + 1;
      statusCounts[inst.subscriptionStatus] =
        (statusCounts[inst.subscriptionStatus] || 0) + 1;
    });

    const totalStudents = institutions.reduce(
      (sum, inst) => sum + inst._count.users,
      0,
    );
    const avgStudents =
      institutions.length > 0
        ? Math.round(totalStudents / institutions.length)
        : 0;

    return {
      totalMRR,
      activePaidSubscriptions: statusCounts['ACTIVE'] || 0,
      trialsAndFree: (statusCounts['TRIAL'] || 0) + (planCounts['FREE'] || 0),
      avgStudentsPerInstitution: avgStudents,
      planCounts,
      statusCounts,
      totalInstitutions: institutions.length,
    };
  }
}
