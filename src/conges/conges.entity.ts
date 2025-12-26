import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Conge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateDebut: Date;

  @Column()
  dateFin: Date;

  @Column({ default: 'EN_ATTENTE' })
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';

  @ManyToOne(() => User, user => user.conges)
  user: User;
}
