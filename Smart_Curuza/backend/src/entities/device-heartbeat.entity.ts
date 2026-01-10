import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('device_heartbeats')
export class DeviceHeartbeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  device_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  last_ping_timestamp: Date;

  @Column({ length: 50, nullable: true })
  ip_address: string;
}
