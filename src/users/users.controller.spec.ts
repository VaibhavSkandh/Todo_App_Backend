import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './../../src/organizations/organizations.controller';
import { OrganizationsService } from './../../src/organizations/organizations.service';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { AuditService } from '../audit/audit.service';
import { Reflector } from '@nestjs/core';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        { provide: OrganizationsService, useValue: {} },
        { provide: AuditService, useValue: { log: jest.fn() } }, // Mock for AuditInterceptor
        AuditInterceptor, // Provide the real interceptor
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});