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

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getAllBilling() {
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

  async getBillingStats() {
    const institutions = await this.prisma.institution.findMany({
      select: {
        plan: true,
        subscriptionStatus: true,
        maxStudents: true,
        _count: { select: { users: true } },
      },
    });

    const planPrices: Record<string, number> = {
      FREE: 0,
      STARTER: 49,
      PROFESSIONAL: 149,
      ENTERPRISE: 499,
    };

    const totalMRR = institutions.reduce((sum, inst) => {
      if (inst.subscriptionStatus === 'ACTIVE') {
        return sum + (planPrices[inst.plan] || 0);
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
