import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Param, Put, Delete } from '@nestjs/common';
import { OwnerGuard } from '../auth/guards/owner.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password: _password, ...result } = user;
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async all() {
    return await this.usersService.findAll();
    // return users.map(({ password: _password, ...rest }) => rest);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDto>,
  ) {
    const updated = await this.usersService.update(id, data);

    // password destructure safely
    const { password: _password, ...result } = updated as any;

    return result;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Get('admin')
  async getAdmins() {
    return this.usersService.getAdmins();
  }
}
