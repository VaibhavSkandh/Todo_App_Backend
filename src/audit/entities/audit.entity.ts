// src/audit/entities/audit.entity.ts

import { User } from './../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  logID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;

  @Column()
  action: string; 

  @Column()
  entityType: string;

  @Column()
  entityID: number;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}