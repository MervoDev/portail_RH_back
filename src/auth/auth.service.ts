import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private  usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email:string, pass:string) {
    const user = await this.usersService.findByEmail(email);

    if (user && await bcrypt.compare(pass, user.password)){
      return user;
    }
      return null;    
    }
   async login(user: any) {
  const payload = { sub: user.id, role: user.role };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
     },
    };
  }
}

