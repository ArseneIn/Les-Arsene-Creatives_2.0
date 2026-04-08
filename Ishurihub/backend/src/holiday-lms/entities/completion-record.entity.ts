import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('completion_records')
@Index(['studentId', 'activityId'], { unique: true })
export class CompletionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  activityId: string;

  @Column({ default: true })
  isCompleted: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number | null;

  @Column({ type: 'jsonb', nullable: true })
  responses: any; // Saves all student responses for teacher review

  @CreateDateColumn()
  completedAt: Date;
}
