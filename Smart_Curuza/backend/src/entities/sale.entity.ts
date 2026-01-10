import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Merchant } from './merchant.entity';
import { Customer } from './customer.entity';
import { DebtLedger } from './debt-ledger.entity';
import { User } from './user.entity';

@Entity('sales')
@Index(['merchant_id'])
@Index(['customer_id'])
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  merchant_id: string;

  @Column({ type: 'uuid', nullable: true })
  customer_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  vat_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  net_amount: number;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ length: 50, default: 'PENDING' })
  sync_status: string;

  @Column({ length: 20, default: 'COMPLETED' })
  status: string; // 'COMPLETED' | 'REFUNDED'

  @Column({ type: 'text', nullable: true })
  refund_reason: string;

  @Column({ type: 'jsonb', nullable: true })
  items: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.sales)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => DebtLedger, (debt) => debt.sale)
  debts: DebtLedger[];

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
