import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities/shift.entity';
import { Sale } from '../entities/sale.entity';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
        private readonly shiftRepository: Repository<Shift>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
    ) { }

    async openShift(userId: string, merchantId: string, startingCash: number) {
        // Check if there is already an open shift for this user
        const existingShift = await this.shiftRepository.findOne({
            where: { user_id: userId, status: 'OPEN' },
        });

        if (existingShift) {
            throw new BadRequestException('You already have an open shift.');
        }

        const shift = this.shiftRepository.create({
            user_id: userId,
            merchant_id: merchantId,
            starting_cash: startingCash,
            expected_cash: startingCash,
            status: 'OPEN',
        });

        return this.shiftRepository.save(shift);
    }

    async closeShift(shiftId: string, actualCash: number, notes?: string) {
        const shift = await this.shiftRepository.findOne({
            where: { id: shiftId },
        });

        if (!shift) {
            throw new NotFoundException('Shift not found.');
        }

        if (shift.status === 'CLOSED') {
            throw new BadRequestException('Shift is already closed.');
        }

        // Calculate expected cash based on sales during shift
        const sales = await this.saleRepository
            .createQueryBuilder('sale')
            .where('sale.user_id = :userId', { userId: shift.user_id })
            .andWhere('sale.created_at >= :startTime', { startTime: shift.start_time })
            .andWhere('sale.payment_method = :method', { method: 'Cash' })
            .getMany();

        const cashSalesTotal = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        shift.expected_cash = Number(shift.starting_cash) + cashSalesTotal;
        shift.actual_cash = actualCash;
        shift.difference = actualCash - shift.expected_cash;
        shift.end_time = new Date();
        shift.status = 'CLOSED';
        shift.notes = notes ?? null;

        return this.shiftRepository.save(shift);
    }

    async getCurrentShift(userId: string) {
        return this.shiftRepository.findOne({
            where: { user_id: userId, status: 'OPEN' },
        });
    }

    async getMerchantShifts(merchantId: string) {
        return this.shiftRepository.find({
            where: { merchant_id: merchantId },
            relations: ['user'],
            order: { start_time: 'DESC' },
        });
    }
}
