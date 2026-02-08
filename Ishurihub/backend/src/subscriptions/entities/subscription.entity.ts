import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  plan: string; // Free, Basic, Premium, Enterprise

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'RWF' })
  currency: string;

  @Column()
  billingCycle: string; // Monthly, Yearly

  @Column()
  status: string; // Active, Cancelled, PastDue

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
