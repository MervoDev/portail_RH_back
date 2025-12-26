import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { RoleGuard } from '../auth/guards/roles.guards';
import { Roles } from './decorators/roles.decorators';
import { LoginDto } from '../auth/dto/login.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from 'src/users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(
      data.email,
      data.password,
    );

    if (!user) throw new UnauthorizedException();

    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
 @Roles(UserRole.ADMIN)

  @Get('all-users')
  findAll() {
    return this.userService.findAll();
  }
}
