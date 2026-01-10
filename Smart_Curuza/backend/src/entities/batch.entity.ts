import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.batches)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  batch_number: string; // e.g., B-20231209-001

  @Column('decimal', { precision: 10, scale: 2 })
  original_quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  current_quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  buying_price_per_unit: number; // Cost per single unit (e.g., per kg)

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  total_cost: number; // Total cost of the batch (e.g., 50,000 for the sack)

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  selling_price: number; // Intended selling price for this batch

  @Column({ type: 'date', nullable: true })
  expiry_date: Date;

  @Column({ default: 'active' })
  status: 'active' | 'depleted' | 'expired';

  @Column({ nullable: true })
  supplier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
