import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Sale } from './sale.entity';

@Entity('debt_ledger')
@Index(['customer_id'])
@Index(['sale_id'])
export class DebtLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customer_id: string;

  @Column({ type: 'uuid' })
  sale_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_due: number;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date;

  @Column({ length: 50, default: 'PENDING' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.debts)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Sale, (sale) => sale.debts)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;
}
