import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Lister tous les users
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Récupérer un user par id
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  // Créer un nouveau user avec hash du mot de passe
  async create(user: Partial<User>): Promise<User> {
    if (!user.password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  // Mettre à jour un user
  async update(id: number, user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  // Supprimer un user
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Trouver un user par mail (pour l'auth)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
