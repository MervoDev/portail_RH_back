import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Conge } from '../conges/conges.entity';
import { Absence } from '../absences/absences.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @OneToMany(() => Conge, (conge) => conge.user)
  conges: Conge[];

  @OneToMany(() => Absence, (absence) => absence.user)
  absences: Absence[];
}
