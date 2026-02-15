import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventOccurrence } from './event-occurrence.entity';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
  LATE = 'LATE',
}

@Entity('event_attendance')
export class EventAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  occurrenceId: string;

  @ManyToOne(() => EventOccurrence, (occurrence) => occurrence.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'occurrenceId' })
  occurrence: EventOccurrence;

  @Column()
  studentId: string;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ nullable: true })
  recordedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recordedById' })
  recordedBy: User;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
