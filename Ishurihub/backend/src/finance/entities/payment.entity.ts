import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  studentName: string;

  @Column()
  studentId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string; // 'Tuition' | 'Uniform' | 'Transport' | 'Other'

  @Column({ type: 'date' })
  date: string;

  @Column()
  status: string; // 'Completed' | 'Pending' | 'Failed'

  @Column()
  method: string; // 'Mobile Money' | 'Bank Transfer' | 'Cash'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
