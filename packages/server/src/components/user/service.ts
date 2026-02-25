import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Role } from '../../entities/Role';
import {
  IUserService,
  IUserRepository,
} from './types';
import {CreateUserInput,
  UpdateUserInput,
  SearchUserInput} from '@gmss/types';
import { Permission } from '@gmss/types';
import ErrorInfo from '../common/error-info';
import { hasPermission, requirePermission, getCurrentEmail } from '../common/utils';

@injectable()
export class UserService implements IUserService {
  private roleRepo: any;
  private readonly userRepository: IUserRepository;
  private readonly dbContext: DataSource;

  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.DbContext) dbContext: DataSource
  ) {
    this.userRepository = userRepository;
    this.dbContext = dbContext;
    this.roleRepo = dbContext.getRepository(Role);
  }

  async createUser(input: CreateUserInput) {
    // Check permission from global context
    requirePermission(Permission.CREATE_USER);

    if (!input.firstName || input.firstName.trim() === '') {
      throw new Error(ErrorInfo.FIRST_NAME_REQUIRED);
    }
    if (!input.email || input.email.trim() === '') {
      throw new Error(ErrorInfo.EMAIL_REQUIRED);
    }

    const role: Role | null = input.roleId ? await this.roleRepo.findOneBy({ id: input.roleId }) : null;
    if (!role && input.roleId) {
      throw new Error(ErrorInfo.ROLE_ID_NOT_EXIST);
    }

    const createdBy = getCurrentEmail() ?? 'SYSTEM';

    return this.userRepository.createUser({
      firstName: input.firstName,
      lastName: input.lastName ?? undefined,
      email: input.email,
      role: role ?? undefined,
      updatedBy: createdBy,
      createdBy: createdBy,
    });
  }

  async updateUser(id: string, input: UpdateUserInput) {
    // Check permission from global context
    requirePermission(Permission.UPDATE_USER);

    const updateData: any = { updatedBy: getCurrentEmail() ?? 'SYSTEM' };

    if (input.roleId !== null && input.roleId !== undefined) {
      const role = await this.roleRepo.findOneBy({ id: input.roleId });
      if (!role) {
        throw new Error(ErrorInfo.ROLE_NOT_EXIST);
      }
      updateData.role = role;
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
    requirePermission(Permission.DELETE_USER);
    return this.userRepository.deleteUser(id);
  }

  deleteUsers(ids: string[]) {
    requirePermission(Permission.DELETE_USER);
    return this.userRepository.deleteUsers(ids);
  }

  getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  searchUser(params?: SearchUserInput) {
    return this.userRepository.search({
      search: params?.search ?? undefined,
      limit: params?.limit ?? undefined,
      offset: params?.offset ?? undefined,
    });
  }
}
