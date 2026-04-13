import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PocketMoneyAccount } from './entities/pocket-money-account.entity';
import {
  PocketMoneyTransaction,
  TransactionType,
} from './entities/pocket-money-transaction.entity';
import {
  CreatePocketMoneyAccountDto,
  DepositDto,
  WithdrawDto,
  UpdateLimitDto,
} from './dto/pocket-money.dto';

@Injectable()
export class PocketMoneyService {
  constructor(
    @InjectRepository(PocketMoneyAccount)
    private accountRepo: Repository<PocketMoneyAccount>,
    @InjectRepository(PocketMoneyTransaction)
    private transactionRepo: Repository<PocketMoneyTransaction>,
  ) {}

  // ─── Accounts ────────────────────────────────────────────────────────────

  async createAccount(
    dto: CreatePocketMoneyAccountDto,
  ): Promise<PocketMoneyAccount> {
    const existing = await this.accountRepo.findOne({
      where: { studentId: dto.studentId },
    });
    if (existing) return existing; // Idempotent: return existing if already exists

    const account = this.accountRepo.create({
      studentId: dto.studentId,
      schoolId: dto.schoolId,
      currency: dto.currency || 'RWF',
      dailySpendingLimit: dto.dailySpendingLimit || 0,
      balance: 0,
    });
    return this.accountRepo.save(account);
  }

  async getAllAccounts(schoolId: string) {
    return this.accountRepo.find({
      where: { schoolId },
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAccountByStudent(studentId: string) {
    return this.accountRepo.findOne({
      where: { studentId },
      relations: ['student'],
    });
  }

  async updateLimit(studentId: string, dto: UpdateLimitDto) {
    const account = await this.accountRepo.findOne({ where: { studentId } });
    if (!account)
      throw new NotFoundException('Wallet not found for this student');
    account.dailySpendingLimit = dto.dailySpendingLimit;
    return this.accountRepo.save(account);
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  async getSchoolSummary(schoolId: string) {
    const accounts = await this.accountRepo.find({ where: { schoolId } });
    const transactions = await this.transactionRepo.find({
      where: { schoolId },
    });

    const totalBalance = accounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0,
    );
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter((a) => a.isActive).length;
    const totalDeposits = transactions
      .filter((t) => t.type === TransactionType.DEPOSIT)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalWithdrawals = transactions
      .filter(
        (t) =>
          t.type === TransactionType.WITHDRAWAL ||
          t.type === TransactionType.PAYMENT,
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalBalance,
      totalAccounts,
      activeAccounts,
      totalDeposits,
      totalWithdrawals,
    };
  }

  // ─── Transactions ─────────────────────────────────────────────────────────

  async deposit(dto: DepositDto): Promise<PocketMoneyTransaction> {
    // Get or auto-create account
    let account = await this.accountRepo.findOne({
      where: { studentId: dto.studentId },
    });
    if (!account) {
      account = await this.createAccount({
        studentId: dto.studentId,
        schoolId: dto.schoolId,
      });
    }

    const balanceBefore = Number(account.balance);
    const balanceAfter = balanceBefore + Number(dto.amount);

    account.balance = balanceAfter;
    await this.accountRepo.save(account);

    const transaction = this.transactionRepo.create({
      accountId: account.id,
      studentId: dto.studentId,
      type: TransactionType.DEPOSIT,
      amount: dto.amount,
      balanceBefore,
      balanceAfter,
      description: dto.description || 'Pocket money deposit',
      reference: dto.reference,
      paymentMethod: dto.paymentMethod || 'Cash',
      performedBy: dto.performedBy,
      schoolId: dto.schoolId,
    });

    return this.transactionRepo.save(transaction);
  }

  async withdraw(dto: WithdrawDto): Promise<PocketMoneyTransaction> {
    const account = await this.accountRepo.findOne({
      where: { studentId: dto.studentId },
    });
    if (!account)
      throw new NotFoundException('No wallet found for this student');

    const balanceBefore = Number(account.balance);
    if (balanceBefore < Number(dto.amount)) {
      throw new BadRequestException(
        `Insufficient balance. Current balance: ${balanceBefore}`,
      );
    }

    const balanceAfter = balanceBefore - Number(dto.amount);
    account.balance = balanceAfter;
    await this.accountRepo.save(account);

    const transaction = this.transactionRepo.create({
      accountId: account.id,
      studentId: dto.studentId,
      type: TransactionType.WITHDRAWAL,
      amount: dto.amount,
      balanceBefore,
      balanceAfter,
      description: dto.description || 'Pocket money withdrawal',
      reference: dto.reference,
      paymentMethod: dto.paymentMethod || 'Cash',
      performedBy: dto.performedBy,
      schoolId: dto.schoolId,
    });

    return this.transactionRepo.save(transaction);
  }

  async getTransactions(schoolId: string, studentId?: string) {
    const where: any = { schoolId };
    if (studentId) where.studentId = studentId;

    return this.transactionRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async getStudentTransactions(studentId: string) {
    const account = await this.accountRepo.findOne({
      where: { studentId },
      relations: ['student'],
    });

    const transactions = await this.transactionRepo.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });

    return { account, transactions };
  }
}
