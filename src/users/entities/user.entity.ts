// src/users/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { List } from './../../lists/entities/list.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  emailVerificationToken: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  authProviderID: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.EMAIL,
  })
  authProvider: AuthProvider;
  
  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  passwordHash: string | null;

  @Column({ type: 'varchar', nullable: true, select: false })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Organization, (organization) => organization.owner)
  organizations: Organization[];

  @Column({ type: 'varchar', nullable: true, select: false })
  hashedRefreshToken?: string;

  @OneToMany(() => List, (list) => list.owner)
  lists: List[];
}