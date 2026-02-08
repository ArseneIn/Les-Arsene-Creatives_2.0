import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  userId: string; // The user who created the ticket

  @Column()
  subject: string;

  @Column('text')
  description: string;

  @Column()
  category: string; // Technical, Billing, Feature, General

  @Column({ default: 'Open' })
  status: string; // Open, In Progress, Resolved, Closed

  @Column({ default: 'Medium' })
  priority: string; // Low, Medium, High, Critical

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
