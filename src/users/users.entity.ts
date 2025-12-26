;import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Conge } from '../conges/conges.entity';
import { Absence } from '../absences/absences.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

   @Column()
  password: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'EMPLOYEE'], default: 'EMPLOYEE' })
  role: UserRole;

  @OneToMany(() => Conge, (conge) => conge.user)
  conges: Conge[];

  @OneToMany(() => Absence, (absence) => absence.user)
  absences: Absence[];
}
