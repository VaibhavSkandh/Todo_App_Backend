// src/organizations/entities/organization.entity.ts
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  organizationID: number; // camelCase

  @Column({ type: 'varchar', length: 255 })
  orgName: string; // camelCase

  @Column({ default: false })
  isDeleted: boolean; // camelCase

  @CreateDateColumn()
  createdAt: Date; // camelCase

  @UpdateDateColumn()
  updatedAt: Date; // camelCase

  // Corrected from user.Organizations to user.organizations
  @ManyToOne(() => User, (user) => user.organizations, { eager: false })
  @JoinColumn({ name: 'ownerID' }) // camelCase
  owner: User; // camelCase
}