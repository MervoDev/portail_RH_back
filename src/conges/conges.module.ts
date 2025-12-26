import { Module } from '@nestjs/common';
import { CongesService } from './conges.service';
import { CongesController } from './conges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conge } from './conges.entity';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Conge]), UsersModule],
  controllers: [CongesController],
  providers: [CongesService],
})
export class CongesModule {}
