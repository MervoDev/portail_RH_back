import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Absence, AbsenceStatus } from './absences.entity';
import { User } from '../users/users.entity';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Toutes les absences (Admin)
  findAll(): Promise<Absence[]> {
    return this.absenceRepository.find({ relations: ['user'] });
  }

  // Les absences d'un utilisateur spécifique
  async findByUser(userId: number): Promise<Absence[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return this.absenceRepository.find({ where: { user }, relations: ['user'] });
  }

  // Créer une absence pour un utilisateur
  async create(userId: number, data: Partial<Absence>): Promise<Absence> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const absence = this.absenceRepository.create({ ...data, user, statut: AbsenceStatus.EN_ATTENTE });
    return this.absenceRepository.save(absence);
  }

  // Valider une absence (Admin)
  async validate(id: number): Promise<Absence> {
    const absence = await this.absenceRepository.findOne({ where: { id }, relations: ['user'] });
    if (!absence) throw new NotFoundException('Absence non trouvée');
    absence.statut = AbsenceStatus.VALIDE;
    return this.absenceRepository.save(absence);
  }

  // Refuser une absence (Admin)
  async reject(id: number): Promise<Absence> {
    const absence = await this.absenceRepository.findOne({ where: { id }, relations: ['user'] });
    if (!absence) throw new NotFoundException('Absence non trouvée');
    absence.statut = AbsenceStatus.REFUSE;
    return this.absenceRepository.save(absence);
  }
}
