import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // Optional because it might not be selected by default

  @Column()
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  roleId: string; // 'super_admin', 'school_admin', 'teacher', 'student', 'parent'

  @ManyToOne('Role', { nullable: true })
  @JoinColumn({ name: 'customRoleId' })
  customRole: any; // Using any to avoid circular dependency issues for now, or use import

  @Column({ nullable: true })
  customRoleId: string;

  @Column({ type: 'text', nullable: true })
  schoolId: string | null;

  @ManyToOne('School', { nullable: true })
  @JoinColumn({ name: 'schoolId' })
  school: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
