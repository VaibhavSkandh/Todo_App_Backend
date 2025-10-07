// src/organizations/entities/organization.entity.ts

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './../../users/entities/user.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  organizationID: number;

  @Column({ type: 'varchar', length: 255 })
  orgName: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.organizations, { eager: false })
  @JoinColumn({ name: 'ownerID' })
  owner: User;
}