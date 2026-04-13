import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('timetable_events')
export class TimetableEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  classId: string; // e.g., 'S3-A'

  @Column()
  day: string; // 'Monday', 'Tuesday', etc.

  @Column({ type: 'int' })
  periodId: number;

  @Column({ nullable: true })
  courseId: string;

  @ManyToOne(() => Course)
  course: Course;

  @Column()
  subject: string;

  @Column()
  teacher: string;

  @Column()
  room: string;

  @Column({ default: 'bg-blue-100 text-blue-700 border-blue-200' })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
