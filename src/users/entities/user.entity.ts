// src/users/entities/user.entity.ts
import { Organization } from '../../organizations/entities/organization.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userID: number; // Corrected to camelCase

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string; // Corrected to camelCase

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string; // Corrected to camelCase

  @Column({ type: 'varchar', length: 50, nullable: true })
  authProvider: string; // Corrected to camelCase

  @Column({ type: 'varchar', length: 255, nullable: true })
  authProviderID: string; // Corrected to camelCase

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash: string; // Corrected to camelCase

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // Corrected to camelCase

  @CreateDateColumn()
  createdAt: Date; // Corrected to camelCase

  @UpdateDateColumn()
  updatedAt: Date; // Corrected to camelCase

  @OneToMany(() => Organization, (organization) => organization.owner)
  organizations: Organization[];
}