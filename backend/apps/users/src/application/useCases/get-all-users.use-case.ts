import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
