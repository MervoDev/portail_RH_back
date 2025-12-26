import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

export enum AbsenceStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REFUSE = 'REFUSE',
}

@Entity('absences')
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateDebut: Date;

  @Column()
  dateFin: Date;

  @Column({ type: 'enum', enum: AbsenceStatus, default: AbsenceStatus.EN_ATTENTE })
  statut: AbsenceStatus;

  @ManyToOne(() => User, (user) => user.absences)
  user: User;
}
