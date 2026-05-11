import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { Shift } from '../entities/shift.entity';
import { Sale } from '../entities/sale.entity';
import { LoginRequest, LoginRequestStatus } from '../entities/login-request.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(LoginRequest)
    private loginRequestsRepository: Repository<LoginRequest>,
  ) { }

  async createStaff(
    merchantId: string,
    data: {
      name: string;
      email?: string;
      password?: string;
      phone?: string;
      pin?: string;
      role: UserRole;
    },
  ) {
    // 1. Check if email exists
    if (data.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser) throw new ConflictException('Email already exists');
    }
    // 2. Check if phone exists
    if (data.phone) {
      const existingUser = await this.usersRepository.findOne({
        where: { phone: data.phone },
      });
      if (existingUser)
        throw new ConflictException('Phone number already exists');
    }

    // 3. Get Merchant
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
    });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // 4. Hash Password/PIN
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;
    const hashedPin = data.pin ? await bcrypt.hash(data.pin, 10) : undefined;

    // 5. Create User
    const newUser = this.usersRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      pin_hash: hashedPin,
      role: data.role || UserRole.CASHIER,
      merchant: merchant,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Return without password/pin
    const { password, pin_hash, ...result } = savedUser;
    return result;
  }

  async getStaff(merchantId: string) {
    return this.usersRepository.find({
      where: { merchant: { id: merchantId } },
      select: ['id', 'name', 'email', 'phone', 'role', 'created_at'], // Exclude sensitive data
      order: { created_at: 'DESC' },
    });
  }

  async removeStaff(id: string) {
    await this.usersRepository.delete(id);
  }

  async getStaffActivity(merchantId: string, staffId: string) {
    // Verify staff belongs to merchant
    const staff = await this.usersRepository.findOne({
      where: { id: staffId, merchant: { id: merchantId } },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Fetch shifts
    const shifts = await this.shiftsRepository.find({
      where: { user_id: staffId, merchant_id: merchantId },
      order: { start_time: 'DESC' },
      take: 50, // Limit to last 50 shifts
    });

    return shifts;
  }

  async getPendingLogins(merchantId: string) {
    // Delete expired requests
    await this.loginRequestsRepository
      .createQueryBuilder()
      .delete()
      .where('status = :status', { status: LoginRequestStatus.PENDING })
      .andWhere('expires_at < :now', { now: new Date() })
      .execute();

    return this.loginRequestsRepository.find({
      where: { merchantId, status: LoginRequestStatus.PENDING },
      relations: ['cashier'],
      order: { created_at: 'DESC' },
    });
  }

  async getTeamProgress(merchantId: string) {
    // Get all cashiers for the merchant
    const cashiers = await this.usersRepository.find({
      where: { merchant: { id: merchantId }, role: UserRole.CASHIER },
      select: ['id', 'name', 'email', 'phone'],
    });

    const progress = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const cashier of cashiers) {
      // Find open shift
      const openShift = await this.shiftsRepository.findOne({
        where: { user_id: cashier.id, end_time: null },
      });

      // Sum sales for today
      const salesQuery = this.salesRepository.createQueryBuilder('sale')
        .where('sale.userId = :userId', { userId: cashier.id })
        .andWhere('sale.created_at >= :today', { today });
      
      const salesResult = await salesQuery.select('SUM(sale.total)', 'totalSales').getRawOne();
      const totalSales = Number(salesResult?.totalSales) || 0;

      progress.push({
        id: cashier.id,
        name: cashier.name,
        email: cashier.email,
        phone: cashier.phone,
        shiftOpen: !!openShift,
        shiftId: openShift?.id,
        totalSales,
      });
    }

    return progress;
  }
}
