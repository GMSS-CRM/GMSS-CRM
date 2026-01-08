import { Repository } from 'typeorm';
import { User } from 'src/entities/User';

/**
 * Responses
 */
export interface SaveUserResponse {
  user?: User;
  errors?: string[];
}

/**
 * Repository contract
 */
export interface IUserRepository extends Repository<User> {
  createUser(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  search(params: SearchUserInput): Promise<User[]>;
  updateUser(id: string, input: UpdateUserInput): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  deleteUsers(ids: string[]): Promise<boolean>;
}

/**
 * Service contract
 */
export interface IUserService {
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<boolean>;
  getById(id: string): Promise<User | null>;
  search(params: SearchUserInput): Promise<User[]>;
}

/**
 * Input DTOs
 */
export interface CreateUserInput {
  firstName: string;
  lastName?: string;
  email: string;
  roleId: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  roleId?: string;
}

export interface SearchUserInput {
  search?: string;
  limit?: number;
  offset?: number;
}
