// src/audit/decorators/audit.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export type AuditMetadata = {
  action: string;
  entityType: string;
  entityIdParam?: string;
};

export const Audit = (metadata: AuditMetadata) => SetMetadata(AUDIT_KEY, metadata);