import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  motto: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'simple-array', nullable: true })
  levels: string[];

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: 'Free' })
  plan: string;

  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @Column({ default: 'Active' })
  subscriptionStatus: string;

  @Column({ default: 'Mixed' })
  genderType: string; // Boys, Girls, Mixed

  @Column({ type: 'date', nullable: true })
  subscriptionEnd: Date;

  @Column({ default: 'Monthly' })
  billingCycle: string;

  @Column({ type: 'json', nullable: true })
  combinations: { name: string; isActive: boolean }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
