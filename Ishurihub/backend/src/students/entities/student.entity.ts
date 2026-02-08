import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  studentId: string; // e.g., 2023-0041

  @Column()
  grade: string; // e.g., Grade 10

  @Column({ nullable: true })
  cardUid: string;

  @Column({ nullable: true })
  section: string;

  @Column({ default: 'Active' })
  status: string; // 'Active' | 'Pending' | 'Inactive'

  @Column({ nullable: true })
  level: string; // 'O-Level' | 'A-Level'

  @Column({ nullable: true })
  year: string; // 'S1' | 'S2' ...

  @Column({ nullable: true })
  combination: string; // Only for A-Level

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column({ nullable: true })
  gender: string; // 'Male' | 'Female'

  @Column({ type: 'jsonb', nullable: true })
  guardians: {
    name: string;
    relation: string;
    phone: string;
    email?: string;
  }[];

  // Deprecated: Migrating to guardians array
  @Column({ nullable: true })
  fatherName: string;

  @Column({ nullable: true })
  motherName: string;

  @Column({ nullable: true })
  primaryPhone: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  schoolId: string;

  @Column({ default: 100 })
  disciplinePoints: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
