import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Customer } from './customer.entity';
import { Sale } from './sale.entity';
import { User } from './user.entity';
import { Shift } from './shift.entity';

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  device_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wallet_balance: number;

  @Column({ length: 50, default: 'UNLOCKED' })
  lock_status: string;

  @Column({ length: 255, default: 'Smart Curuza Shop' })
  business_name: string;

  @Column({ type: 'text', default: 'Kigali, Rwanda' })
  address: string;

  @Column({ length: 50, default: '+250 788 123 456' })
  phone: string;

  @Column({ length: 50, nullable: true })
  tin: string;

  @Column({ nullable: true })
  registration_doc_url: string;

  @Column({ nullable: true })
  owner_id_doc_url: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 18.0 })
  vat_rate: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'TRIAL'],
    default: 'TRIAL',
  })
  subscription_status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';

  @Column({ type: 'timestamptz', nullable: true })
  subscription_expiry: Date;

  @Column({ type: 'timestamptz', nullable: true })
  last_payment_date: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relations
  @OneToMany(() => Product, (product) => product.merchant)
  products: Product[];

  @OneToMany(() => Customer, (customer) => customer.merchant)
  customers: Customer[];

  @OneToMany(() => Sale, (sale) => sale.merchant)
  sales: Sale[];

  @OneToMany(() => User, (user) => user.merchant)
  users: User[];

  @OneToMany(() => Shift, (shift) => shift.merchant)
  shifts: Shift[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
