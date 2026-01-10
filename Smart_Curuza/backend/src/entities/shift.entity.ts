import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Merchant } from './merchant.entity';

@Entity('shifts')
export class Shift {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    merchant_id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    start_time: Date;

    @Column({ type: 'timestamptz', nullable: true })
    end_time: Date;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    starting_cash: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    expected_cash: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    actual_cash: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    difference: number;

    @Column({
        type: 'enum',
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN',
    })
    status: 'OPEN' | 'CLOSED';

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    // Relations
    @ManyToOne(() => Merchant)
    @JoinColumn({ name: 'merchant_id' })
    merchant: Merchant;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
