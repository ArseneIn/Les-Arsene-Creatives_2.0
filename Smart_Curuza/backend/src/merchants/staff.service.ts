import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  IsNull,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { Shift } from '../entities/shift.entity';
import { Sale } from '../entities/sale.entity';
import {
  LoginRequest,
  LoginRequestStatus,
} from '../entities/login-request.entity';
import * as bcrypt from 'bcryptjs';

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
  ) {}

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

    // Return without password/pin (destructure to exclude them)
    const { password: _, pin_hash: __, ...result } = savedUser;
    void _;
    void __;
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

  async getStaffSales(
    merchantId: string,
    staffId: string,
    limit = 500,
    startDate?: string,
    endDate?: string,
  ) {
    // Verify staff belongs to merchant
    const staff = await this.usersRepository.findOne({
      where: { id: staffId, merchant: { id: merchantId } },
      select: ['id', 'name', 'email', 'phone', 'role'],
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Build date range filter
    let dateFilter: { created_at?: any } = {};
    if (startDate && endDate) {
      // Boundaries adjusted for Kigali (UTC+2)
      const start = new Date(startDate);
      start.setHours(start.getHours() - 2);

      const end = new Date(endDate);
      end.setHours(23 - 2, 59, 59, 999);
      dateFilter = { created_at: Between(start, end) };
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter = { created_at: MoreThanOrEqual(start) };
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { created_at: LessThanOrEqual(end) };
    }

    const sales = await this.salesRepository.find({
      where: { merchant_id: merchantId, user_id: staffId, ...dateFilter },
      order: { created_at: 'DESC' },
      take: limit,
    });

    const totalRevenue = sales
      .filter((s) => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + Number(s.total), 0);

    return {
      staff,
      sales,
      summary: {
        totalSales: sales.filter((s) => s.status === 'COMPLETED').length,
        totalRevenue,
        refunds: sales.filter((s) => s.status === 'REFUNDED').length,
      },
    };
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

    const progress: {
      id: string;
      name: string;
      email: string;
      phone: string;
      shiftOpen: boolean;
      shiftId?: string;
      totalSales: number;
    }[] = [];

    // Adjust today for Kigali timezone (UTC+2)
    // 00:00:00 Kigali = 22:00:00 UTC (previous day)
    const kigaliNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const startDate = kigaliNow.toISOString().split('T')[0];
    const today = new Date(startDate);
    today.setHours(today.getHours() - 2);

    for (const cashier of cashiers) {
      // Find open shift
      const openShift = await this.shiftsRepository.findOne({
        where: { user_id: cashier.id, end_time: IsNull() },
      });

      // Sum sales for today
      const salesQuery = this.salesRepository
        .createQueryBuilder('sale')
        .where('sale.user_id = :userId', { userId: cashier.id })
        .andWhere('sale.created_at >= :today', { today });

      const salesResult = await salesQuery
        .select('SUM(sale.total)', 'totalSales')
        .getRawOne<{ totalSales: string | null }>();
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
