import { CreateUserUseCase } from '../../src/application/useCases/create-user.use-case';
import { DeleteUserUseCase } from '../../src/application/useCases/delete-user.use-case';
import { GetAllUsersUseCase } from '../../src/application/useCases/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../src/application/useCases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../src/application/useCases/update-user.use-case';
import { User } from '../../src/domain/entities/user.entity';
import { EntityNotFoundError } from '../../src/domain/errors/entity-not-found.error';
import { Email } from '../../src/domain/value-objects/email.value-object';
import { toSnakeCaseDeep } from '../../src/common/utils/case.util';

import { UsersController } from '../../src/controllers/users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: { execute: jest.Mock };
  let getAllUsersUseCase: { execute: jest.Mock };
  let getUserByIdUseCase: { execute: jest.Mock };
  let updateUserUseCase: { execute: jest.Mock };
  let deleteUserUseCase: { execute: jest.Mock };

  const user = User.reconstitute(
    {
      firstName: 'John',
      lastName: 'Doe',
      email: new Email('john@example.com'),
      passwordHash: 'hash',
      createdAt: new Date('2024-01-01'),
    },
    'user-id',
  );

  beforeEach(() => {
    createUserUseCase = { execute: jest.fn() };
    getAllUsersUseCase = { execute: jest.fn() };
    getUserByIdUseCase = { execute: jest.fn() };
    updateUserUseCase = { execute: jest.fn() };
    deleteUserUseCase = { execute: jest.fn() };
    controller = new UsersController(
      createUserUseCase as unknown as CreateUserUseCase,
      getAllUsersUseCase as unknown as GetAllUsersUseCase,
      getUserByIdUseCase as unknown as GetUserByIdUseCase,
      updateUserUseCase as unknown as UpdateUserUseCase,
      deleteUserUseCase as unknown as DeleteUserUseCase,
    );
  });

  it('creates and serializes user', async () => {
    createUserUseCase.execute.mockResolvedValue(user);

    const result = await controller.createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
    });

    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
    });
    expect(toSnakeCaseDeep(result)).toEqual(toSnakeCaseDeep(user.toJson()));
  });

  it('returns all users serialized', async () => {
    getAllUsersUseCase.execute.mockResolvedValue([user]);

    const result = await controller.getAllUsers();

    expect(getAllUsersUseCase.execute).toHaveBeenCalledTimes(1);
    expect(toSnakeCaseDeep(result)).toEqual(toSnakeCaseDeep([user.toJson()]));
  });

  it('gets user by id', async () => {
    getUserByIdUseCase.execute.mockResolvedValue(user);

    const result = await controller.getUserById('user-id');

    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith({ id: 'user-id' });
    expect(toSnakeCaseDeep(result)).toEqual(toSnakeCaseDeep(user.toJson()));
  });

  it('updates user by id', async () => {
    updateUserUseCase.execute.mockResolvedValue(user);

    const result = await controller.updateUser('user-id', { firstName: 'John' });

    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'user-id',
      firstName: 'John',
    });
    expect(toSnakeCaseDeep(result)).toEqual(toSnakeCaseDeep(user.toJson()));
  });

  it('deletes user by id', async () => {
    deleteUserUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteUser('user-id');

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith({ id: 'user-id' });
  });

  it('returns exists=true when user exists', async () => {
    getUserByIdUseCase.execute.mockResolvedValue(user);

    const result = await controller.checkUserExists('user-id');

    expect(result).toEqual({ exists: true });
  });

  it('returns exists=false for entity not found', async () => {
    getUserByIdUseCase.execute.mockRejectedValue(new EntityNotFoundError('User'));

    const result = await controller.checkUserExists('missing-id');

    expect(result).toEqual({ exists: false });
  });
});

