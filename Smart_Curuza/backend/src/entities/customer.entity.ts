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
import { Sale } from './sale.entity';
import { DebtLedger } from './debt-ledger.entity';

@Entity('customers')
@Index(['merchant_id', 'phone'], { unique: true })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  merchant_id: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_debt: number;

  @Column({ type: 'int', default: 0 })
  loyalty_points: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.customers)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales: Sale[];

  @OneToMany(() => DebtLedger, (debt) => debt.customer)
  debts: DebtLedger[];
}
