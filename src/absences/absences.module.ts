import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { Absence } from './absences.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Absence, User])],
  providers: [AbsencesService],
  controllers: [AbsencesController],
})
export class AbsencesModule {}
