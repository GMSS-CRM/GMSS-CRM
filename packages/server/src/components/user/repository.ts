import { inject, injectable } from 'inversify';
import { DataSource, Like, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { User } from '../../entities/User';
import {
  IUserRepository,
} from './types';

@injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.DbContext) private readonly dbContext: DataSource
  ) {
    super(User, dbContext.manager);
  }

  createUser(user: Partial<User>) {
    return this.save(this.create(user));
  }

  findById(id: string) {
    return this.findOne({
      where: { id, isDeleted: false },
      relations: ['role'],
    });
  }

  findByEmail(email: string) {
    return this.findOne({
      where: { email, isDeleted: false },
      relations: ['role'],
    });
  }

  search(params: { search?: string; limit?: number; offset?: number }) {
    const searchTerm = params.search?.trim();
    const where = searchTerm
      ? [
          { isDeleted: false, firstName: Like(`%${searchTerm}%`) },
          { isDeleted: false, lastName: Like(`%${searchTerm}%`) },
          { isDeleted: false, email: Like(`%${searchTerm}%`) },
        ]
      : { isDeleted: false };

    return this.find({
      where,
      relations: ['role'],
      take: params.limit,
      skip: params.offset,
    });
  }

  updateUser(id: string, user: Partial<User>) {
    return this.update(id, user).then(() => this.findById(id));
  }

  deleteUser(id: string) {
    return this.update(id, { isDeleted: true }).then(() => true);
  }

  deleteUsers(ids: string[]) {
    return this.update({ id: ids as any }, { isDeleted: true }).then(() => true);
  }
}
