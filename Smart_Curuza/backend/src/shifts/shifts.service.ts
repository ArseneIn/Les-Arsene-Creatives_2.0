import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities/shift.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getCurrentShift(userId: string): Promise<Shift | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['merchant'],
    });

    if (!user || !user.merchant) {
      throw new NotFoundException('User or Merchant not found');
    }

    // Find the latest OPEN shift for the merchant
    const lastShift = await this.shiftRepository.findOne({
      where: {
        merchant: { id: user.merchant.id },
        status: 'OPEN',
      },
      order: { start_time: 'DESC' },
    });

    return lastShift;
  }

  async getShiftHistory(userId: string): Promise<Shift[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['merchant'],
    });

    if (!user || !user.merchant) {
      throw new NotFoundException('User or Merchant not found');
    }

    return this.shiftRepository.find({
      where: { merchant: { id: user.merchant.id } },
      order: { start_time: 'DESC' },
      take: 50,
    });
  }

  async openShift(userId: string, startingCash: number): Promise<Shift> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['merchant'],
    });

    if (!user || !user.merchant) {
      throw new NotFoundException('User or Merchant not found');
    }

    // Check if there is already an open shift for this merchant
    const existingShift = await this.shiftRepository.findOne({
      where: {
        merchant: { id: user.merchant.id },
        status: 'OPEN',
      },
    });

    if (existingShift) {
      throw new BadRequestException(
        'There is already an open shift for this merchant.',
      );
    }

    const newShift = this.shiftRepository.create({
      merchant: user.merchant,
      user: user,
      starting_cash: startingCash,
      expected_cash: startingCash, // Initially expected cash is starting cash
      start_time: new Date(),
      status: 'OPEN',
    });

    return this.shiftRepository.save(newShift);
  }

  async closeShift(
    shiftId: string,
    actualCash: number,
    notes?: string,
  ): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id: shiftId },
    });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (shift.status === 'CLOSED') {
      throw new BadRequestException('Shift is already closed');
    }

    shift.actual_cash = actualCash;
    shift.notes = notes || null;
    shift.end_time = new Date();
    shift.status = 'CLOSED';

    // Calculate difference
    // Ensure numbers are treated as numbers
    const expected = Number(shift.expected_cash);
    const actual = Number(actualCash);
    shift.difference = actual - expected;

    return this.shiftRepository.save(shift);
  }
}
