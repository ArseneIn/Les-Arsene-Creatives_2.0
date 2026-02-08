import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('discipline_records')
export class DisciplineRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @ManyToOne(() => Student, { eager: true }) // Auto-fetch student details
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  type: string; // 'Merit' | 'Sanction' | 'Report'

  @Column()
  category: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  reportedBy: string;

  @Column({ nullable: true })
  severity: string;

  @Column({ type: 'int', nullable: true })
  points: number;

  @Column({ default: 'Pending' })
  status: string; // 'Pending' | 'Resolved' | 'Archived'

  @Column({ nullable: true })
  actionTaken: string;

  @Column()
  schoolId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
