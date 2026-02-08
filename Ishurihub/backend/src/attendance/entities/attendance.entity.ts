import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ nullable: true })
  teacherId: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: 'Present' })
  status: string; // 'Present' | 'Absent' | 'Late' | 'Excuse'

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  termId: string;

  @Column({ nullable: true })
  classId: string;

  @Column()
  schoolId: string;

  @CreateDateColumn()
  createdAt: Date;
}
