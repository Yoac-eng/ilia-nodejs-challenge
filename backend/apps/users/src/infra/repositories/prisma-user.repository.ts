import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';
import { prisma } from '../lib/prisma';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async create(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    await prisma.user.create({
      data,
    });
  }

  async update(user: User): Promise<void> {
    const data = UserMapper.toUpdatePersistence(user);

    await prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    const persistedUser = await prisma.user.findUnique({
      where: { id },
    });

    return persistedUser ? UserMapper.toDomain(persistedUser) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const persistedUser = await prisma.user.findUnique({
      where: { email: email.toString() },
    });

    return persistedUser ? UserMapper.toDomain(persistedUser) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
