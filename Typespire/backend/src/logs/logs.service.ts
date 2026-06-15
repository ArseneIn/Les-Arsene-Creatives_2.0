import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface CreateLogDto {
  action: string;
  category?: string;
  actorId?: string;
  actorName?: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
  severity?: string;
}

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async log(dto: CreateLogDto) {
    return this.prisma.systemLog.create({
      data: {
        action: dto.action,
        category: dto.category ?? 'GENERAL',
        actorId: dto.actorId,
        actorName: dto.actorName,
        targetId: dto.targetId,
        targetName: dto.targetName,
        metadata:
          dto.metadata !== undefined
            ? (dto.metadata as Prisma.InputJsonValue)
            : undefined,
        severity: dto.severity ?? 'INFO',
      },
    });
  }

  async findAll(options?: {
    category?: string;
    severity?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: Record<string, unknown> = {};
    if (options?.category && options.category !== 'ALL')
      where.category = options.category;
    if (options?.severity && options.severity !== 'ALL')
      where.severity = options.severity;

    const [total, logs] = await Promise.all([
      this.prisma.systemLog.count({ where }),
      this.prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit ?? 50,
        skip: options?.offset ?? 0,
      }),
    ]);

    return { total, logs };
  }
}
