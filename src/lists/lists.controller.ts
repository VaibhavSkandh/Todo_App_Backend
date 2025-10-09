// src/lists/lists.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './../../src/auth/decorators/get-user.decorator';
import { User } from './../../src/users/entities/user.entity';

@Controller('lists')
@UseGuards(AuthGuard('jwt'))
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: CreateListDto, @GetUser() user: User) {
    return this.listsService.create(createListDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.listsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.listsService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto, @GetUser() user: User) {
    return this.listsService.update(+id, updateListDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.listsService.remove(+id, user);
  }
}