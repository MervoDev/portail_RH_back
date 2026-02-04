import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conge, CongeStatus } from './conges.entity';
import { User } from '../users/users.entity';

@Injectable()
export class CongesService {
  constructor(
    @InjectRepository(Conge)
    private congeRepository: Repository<Conge>,
  ) {}

  // Lister toutes les demandes
  findAll(): Promise<Conge[]> {
    return this.congeRepository.find({ order: { id: 'DESC' }, relations: ['user'] });
  }

  // Lister les demandes d'un utilisateur
  findByUser(userId: number): Promise<Conge[]> {
    return this.congeRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
      relations: ['user'],
    });
  }

  // Créer une demande
  async create(userId: number, data: Partial<Conge>): Promise<Conge> {
    console.log("DATA RECEIVED:", data, "USERID:", userId);
    const conge = this.congeRepository.create({
      ...data,
      user: { id: userId } as User, // Relation ManyToOne avec User
      statut: CongeStatus.EN_ATTENTE,
    });
    return this.congeRepository.save(conge);
  }

  // Valider une demande
  async validate(id: number): Promise<Conge | null> {
    const conge = await this.congeRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!conge) throw new NotFoundException('Demande introuvable');
    conge.statut = CongeStatus.VALIDE;
    return this.congeRepository.save(conge);
  }

  // Refuser une demande
  async reject(id: number): Promise<Conge | null> {
    const conge = await this.congeRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!conge) throw new NotFoundException('Demande introuvable');
    conge.statut = CongeStatus.REFUSE;
    return this.congeRepository.save(conge);
  }
}
