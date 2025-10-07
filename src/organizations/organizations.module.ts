// src/organizations/organizations.module.ts

import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { AuditModule } from 'src/audit/audit.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User]),
    AuditModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}