import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserType } from '../enums/userType.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN)
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  findAll() {
    return this._usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this._usersService.create(createUserDto);
  }

  @Delete(':id')
  disable(@Param('id') id: string) {
    return this._usersService.disable(id);
  }

  @Post(':id/enable')
  enable(@Param('id') id: string) {
    return this._usersService.enable(id);
  }
}
