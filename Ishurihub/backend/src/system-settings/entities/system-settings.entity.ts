import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'IshuriHub' })
  platformName: string;

  @Column({ default: false })
  isMaintenanceMode: boolean;

  @Column({ nullable: true })
  maintenanceMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  maintenanceStartsAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
