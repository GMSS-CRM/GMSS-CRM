import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IUserService,
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
  SearchUserInput,
} from './types';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  create(input: CreateUserInput) {
    return this.userRepository.createUser(input);
  }

  update(id: string, input: UpdateUserInput) {
    return this.userRepository.updateUser(id, input);
  }

  delete(id: string) {
    return this.userRepository.deleteUser(id);
  }

  deleteMany(ids: string[]) {
    return this.userRepository.deleteUsers(ids);
  }

  getById(id: string) {
    return this.userRepository.findById(id);
  }

  search(params: SearchUserInput) {
    return this.userRepository.search(params);
  }
}
