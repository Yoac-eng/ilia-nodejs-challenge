import type { User as PrismaUser } from '@generated/clients/users';

import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';

export class UserMapper {
  public static toPersistence(domainUser: User): PrismaUser {
    return {
      id: domainUser.id,
      firstName: domainUser.firstName,
      lastName: domainUser.lastName,
      email: domainUser.email.toString(),
      passwordHash: domainUser.passwordHash,
      createdAt: domainUser.createdAt,
    };
  }

  public static toUpdatePersistence(domainUser: User): Omit<PrismaUser, 'id'> {
    const persistence = this.toPersistence(domainUser);
    return {
      firstName: persistence.firstName,
      lastName: persistence.lastName,
      email: persistence.email,
      passwordHash: persistence.passwordHash,
      createdAt: persistence.createdAt,
    };
  }

  public static toDomain(raw: PrismaUser): User {
    return User.reconstitute(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: new Email(raw.email),
        passwordHash: raw.passwordHash,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
