import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import type {
  CreateUserInput,
  UpdateUserInput,
  SearchUserInput,
} from '@gmss/types';

export interface IUserRepository extends Repository<User> {
  createUser(user: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  search(params: { search?: string; limit?: number; offset?: number }): Promise<User[]>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  deleteUsers(ids: string[]): Promise<boolean>;
}

/**
 * Service contract
 */
export interface IUserService {
  createUser(input: CreateUserInput, context?: { id?: string; email?: string; roleId?: string; roleName?: string }): Promise<User>;
  updateUser(id: string, input: UpdateUserInput): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  deleteUsers(ids: string[]): Promise<boolean>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  searchUser(params?: SearchUserInput): Promise<User[]>;
}
