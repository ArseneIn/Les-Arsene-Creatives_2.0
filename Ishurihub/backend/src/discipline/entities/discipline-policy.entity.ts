import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('discipline_policies')
export class DisciplinePolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  name: string; // e.g., "Late for Class", "Outstanding Leadership"

  @Column({ type: 'varchar' }) // 'Merit' or 'Sanction'
  type: string;

  @Column({ default: 0 })
  points: number;

  @Column({ nullable: true })
  severity: string; // 'Low', 'Medium', 'High', 'Critical' (only for Sanctions)

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
