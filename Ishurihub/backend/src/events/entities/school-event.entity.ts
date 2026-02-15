import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { School } from '../../schools/entities/school.entity';
import { EventOccurrence } from './event-occurrence.entity';

export enum EventType {
  RELIGIOUS = 'RELIGIOUS',
  ACADEMIC = 'ACADEMIC',
  SPORT = 'SPORT',
  CULTURAL = 'CULTURAL',
  OTHER = 'OTHER',
}

export enum TargetAudience {
  ALL = 'ALL',
  CLASS = 'CLASS',
  STREAM = 'STREAM',
}

@Entity('school_events')
export class SchoolEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.OTHER,
  })
  eventType: EventType;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ default: false })
  isRecurring: boolean;

  // JSON column to store recurrence rules e.g., { type: 'WEEKLY', days: [1, 5] }
  @Column({ type: 'jsonb', nullable: true })
  recurrencePattern: any;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ default: false })
  isMandatory: boolean;

  @Column({
    type: 'enum',
    enum: TargetAudience,
    default: TargetAudience.ALL,
  })
  targetAudience: TargetAudience;

  // For targeted audience (e.g., specific class IDs)
  @Column('simple-array', { nullable: true })
  targetIds: string[];

  @Column()
  schoolId: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @OneToMany(() => EventOccurrence, (occurrence) => occurrence.event)
  occurrences: EventOccurrence[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
