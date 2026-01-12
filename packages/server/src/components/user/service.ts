import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Role } from '../../entities/Role';
import {
  IUserService,
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
  SearchUserInput,
} from './types';

@injectable()
export class UserService implements IUserService {
  private roleRepo: any;

  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.DbContext)
    private readonly dbContext: DataSource
  ) {
    this.roleRepo = dbContext.getRepository(Role);
  }

  createUser(input: CreateUserInput) {
    if (!input.firstName || input.firstName.trim() === '') {
      throw new Error('First name is required');
    }
    if (!input.email || input.email.trim() === '') {
      throw new Error('Email is required');
    }

    return this.roleRepo.findOneBy({ id: input.roleId }).then((role: Role) => {
      if (!role) {
        throw new Error('Invalid roleId');
      }

      return this.userRepository.createUser({
        firstName: input.firstName,
        lastName: input.lastName ?? undefined,
        email: input.email,
        role,
        updatedBy: 'SYSTEM',
      });
    });
  }

  updateUser(id: string, input: UpdateUserInput) {
    const updateData: any = { updatedBy: 'SYSTEM' };

    if (input.roleId !== null && input.roleId !== undefined) {
      return this.roleRepo.findOneBy({ id: input.roleId }).then((role: Role) => {
        if (!role) {
          throw new Error('Invalid roleId');
        }
        updateData.role = role;

        if (input.firstName !== null && input.firstName !== undefined) {
          updateData.firstName = input.firstName;
        }

        if (input.lastName !== null && input.lastName !== undefined) {
          updateData.lastName = input.lastName;
        }

        return this.userRepository.updateUser(id, updateData);
      });
    }

    if (input.firstName !== null && input.firstName !== undefined) {
      updateData.firstName = input.firstName;
    }

    if (input.lastName !== null && input.lastName !== undefined) {
      updateData.lastName = input.lastName;
    }

    return this.userRepository.updateUser(id, updateData);
  }

  deleteUser(id: string) {
    return this.userRepository.deleteUser(id);
  }

  deleteUsers(ids: string[]) {
    return this.userRepository.deleteUsers(ids);
  }

  getById(id: string) {
    return this.userRepository.findById(id);
  }

  searchUser(params: SearchUserInput) {
    return this.userRepository.search({
      search: params.search ?? undefined,
      limit: params.limit ?? undefined,
      offset: params.offset ?? undefined,
    });
  }
}
