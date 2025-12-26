import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CongesService } from './conges.service';
import { Conge } from './conges.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleGuard } from '../auth/guards/roles.guards';
import { UserRole } from '../users/users.entity';
import type { Request } from 'express';

// Interface pour typer correctement req.user
interface JwtRequest extends Request {
  user: { sub: number; role: UserRole };
}

@Controller('conges')
@UseGuards(AuthGuard('jwt')) // Toutes les routes nécessitent authentification
export class CongesController {
  constructor(private readonly congesService: CongesService) {}

  // ADMIN : voir toutes les demandes
  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  findAll(): Promise<Conge[]> {
    return this.congesService.findAll();
  }

  // EMPLOYÉ : voir ses propres demandes
  @Get('my')
  findMy(@Req() req: JwtRequest): Promise<Conge[]> {
    const userId = req.user.sub;
    return this.congesService.findByUser(userId);
  }

  // EMPLOYÉ : créer une nouvelle demande
  @Post()
  create(@Req() req: JwtRequest, @Body() congeData: Partial<Conge>): Promise<Conge> {
    const userId = req.user.sub;
    return this.congesService.create(userId, congeData);
  }

  // ADMIN : valider un congé
  @Patch(':id/validate')
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  validate(@Param('id', ParseIntPipe) id: number): Promise<Conge | null> {
    return this.congesService.validate(id);
  }

  // ADMIN : refuser un congé
  @Patch(':id/reject')
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  reject(@Param('id', ParseIntPipe) id: number): Promise<Conge | null> {
    return this.congesService.reject(id);
  }
}
