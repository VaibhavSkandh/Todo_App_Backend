// src/audit/audit.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AUDIT_KEY, AuditMetadata } from './decorators/audit.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get<AuditMetadata>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    return next.handle().pipe(
      tap((data) => {
        // 👇 Initialize the variable here
        let entityId: number | undefined;

        if (auditMetadata.entityIdParam) {
          entityId = request.params[auditMetadata.entityIdParam];
        } else if (data && data.userID) {
          entityId = data.userID;
        } else if (data && data.organizationID) {
          entityId = data.organizationID;
        }

        // This check now safely handles the case where entityId might be undefined
        if (user && entityId) {
          this.auditService.log({
            action: auditMetadata.action,
            entityType: auditMetadata.entityType,
            entityID: entityId,
            user: user,
            details: request.body,
          });
        }
      }),
    );
  }
}