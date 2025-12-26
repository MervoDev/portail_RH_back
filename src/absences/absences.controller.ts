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
import { AbsencesService } from './absences.service';
import { Absence } from './absences.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleGuard } from '../auth/guards/roles.guards';
import { UserRole } from '../users/users.entity';
import type { Request } from 'express';

// Interface pour typer correctement req.user
interface JwtRequest extends Request {
  user: { sub: number; role: UserRole };
}

@Controller('absences')
@UseGuards(AuthGuard('jwt')) // Toutes les routes nécessitent authentification
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  // ADMIN : voir toutes les absences
  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  findAll(): Promise<Absence[]> {
    return this.absencesService.findAll();
  }

  // EMPLOYÉ : voir ses propres absences
  @Get('my')
  findMy(@Req() req: JwtRequest): Promise<Absence[]> {
    const userId = req.user.sub;
    return this.absencesService.findByUser(userId);
  }

  // EMPLOYÉ : créer une nouvelle absence
  @Post()
  create(@Req() req: JwtRequest, @Body() data: Partial<Absence>): Promise<Absence> {
    const userId = req.user.sub;
    return this.absencesService.create(userId, data);
  }

  // ADMIN : valider une absence
  @Patch(':id/validate')
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  validate(@Param('id', ParseIntPipe) id: number): Promise<Absence | null> {
    return this.absencesService.validate(id);
  }

  // ADMIN : refuser une absence
  @Patch(':id/reject')
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  reject(@Param('id', ParseIntPipe) id: number): Promise<Absence | null> {
    return this.absencesService.reject(id);
  }
}
