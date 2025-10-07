// src/audit/audit.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';

export interface AuditLogPayload {
  user: User;
  action: string;
  entityType: string;
  entityID: number;
  details?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(payload: AuditLogPayload): Promise<AuditLog> {
    const newLog = this.auditRepository.create(payload);
    return this.auditRepository.save(newLog);
  }
}