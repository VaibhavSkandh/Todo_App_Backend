// src/lists/entities/list.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './../../users/entities/user.entity';
import { Organization } from './../../organizations/entities/organization.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  listID: number;

  @Column({ type: 'varchar', length: 255 })
  listName: string;

  @Column({ type: 'varchar', length: 20, default: 'private' })
  visibility: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // --- Relationships ---
  @ManyToOne(() => User, (user) => user.lists)
  @JoinColumn({ name: 'ownerUserID' })
  owner: User;

  @ManyToOne(() => Organization, (organization) => organization.lists, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationID' })
  organization: Organization | null;
}