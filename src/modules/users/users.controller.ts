import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminDto } from './dto/create-admin';
import { Roles } from 'src/decorators/roles-decorators';
import { SuperAdmindTO } from './dto/create-superadmin';
import { Request } from 'express';
import { Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/:email')
  async getUser(@Param('email') email: string, @Req() req: Request) {
    return await this.usersService.findByEmail(email);
  }
  @Post('/createadmin')
  async createAdmin(@Body() data: AdminDto) {
    return await this.usersService.createAdmin(data);
  }
  @Delete('/:id')
  async deleteAdmin(@Param('id') id: string) {
    return await this.usersService.deleteAdmin(id);
  }
  @Post('/superadmin')
  @Roles('SUPERADMIN')
  create(@Body() createCreateadminDto: AdminDto) {
    return this.usersService.createAdmin(createCreateadminDto);
  }
}
