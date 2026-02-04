import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

export enum CongeStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REFUSE = 'REFUSE',
}

@Entity()
export class Conge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ type: 'enum', enum: CongeStatus, default: CongeStatus.EN_ATTENTE })
  statut: CongeStatus;

  @ManyToOne(() => User, user => user.conges)
  user: User;
}
