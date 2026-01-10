import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: 'info' }) // info, warning, error, success
  type: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true })
  user_id: string; // Optional: if specific to a user, otherwise system-wide for the merchant?
  // For now, let's assume notifications are for the merchant/shop, so maybe link to Merchant?
  // Or just keep it simple and link to User if we have multi-user.
  // Given current state (1 User = 1 Merchant), linking to User is fine.

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
