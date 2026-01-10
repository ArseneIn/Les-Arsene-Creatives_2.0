import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Merchant } from './merchant.entity';
import { Batch } from './batch.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  merchant_id: string;

  @Column({ length: 255, nullable: true })
  barcode: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1.0 })
  conversion_factor: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stock: number;

  @Column({ length: 50, default: 'pcs' })
  unit: string;

  @Column({ length: 50, nullable: true })
  buying_unit: string;

  @Column({ length: 20, nullable: true })
  itemClsCd: string; // RRA Item Class Code

  @Column({ length: 10, nullable: true })
  taxTyCd: string; // RRA Tax Type Code

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.products)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => Product, (product) => product.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Product;

  @OneToMany(() => Product, (product) => product.parent)
  children: Product[];

  @OneToMany(() => Batch, (batch) => batch.product)
  batches: Batch[];
}
