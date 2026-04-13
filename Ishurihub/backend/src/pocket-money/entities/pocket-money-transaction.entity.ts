import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PocketMoneyAccount } from './pocket-money-account.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PAYMENT = 'payment',
  REFUND = 'refund',
}

@Entity('pocket_money_transactions')
export class PocketMoneyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @ManyToOne(() => PocketMoneyAccount)
  @JoinColumn({ name: 'accountId' })
  account: PocketMoneyAccount;

  @Column()
  studentId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference: string; // External payment reference or merchant ID

  @Column({ nullable: true })
  performedBy: string; // userId of admin/cashier who performed the transaction

  @Column({ default: 'Cash' })
  paymentMethod: string; // 'Cash' | 'Mobile Money' | 'NFC Card' | 'Bank'

  @Column()
  schoolId: string;

  @CreateDateColumn()
  createdAt: Date;
}
