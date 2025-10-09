// src/lists/lists.module.ts

import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Organization } from './../../src/organizations/entities/organization.entity';
import { AuthModule } from './../../src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([List, Organization]),
    AuthModule,
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}