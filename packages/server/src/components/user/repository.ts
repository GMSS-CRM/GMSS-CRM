import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { User } from '../../entities/User';
import { Role } from '../../entities/Role';
import {
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
  SearchUserInput,
} from './types';

@injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private roleRepo: Repository<Role>;

  constructor(
    @inject(TYPES.DbContext) private readonly dbContext: DataSource
  ) {
    super(User, dbContext.manager);
    this.roleRepo = dbContext.getRepository(Role);
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const { roleId, ...rest } = input;

    const role = await this.roleRepo.findOneBy({ id: roleId });
    if (!role) throw new Error('Invalid roleId');

    const user = this.create({
      ...rest,
      role,
      updatedBy: 'SYSTEM',
    });

    return this.save(user);
  }

  findById(id: string) {
    return this.findOne({
      where: { id, isDeleted: false },
      relations: ['role'],
    });
  }

  search(params: SearchUserInput) {
    return this.find({
      where: { isDeleted: false },
      relations: ['role'],
      take: params.limit,
      skip: params.offset,
    });
  }

  async updateUser(id: string, input: UpdateUserInput) {
    if (input.roleId) {
      const role = await this.roleRepo.findOneBy({ id: input.roleId });
      if (!role) throw new Error('Invalid roleId');

      (input as any).role = role;
      delete (input as any).roleId;
    }

    await this.update(id, {
      ...input,
      updatedBy: 'SYSTEM',
    });

    return this.findById(id);
  }

  async deleteUser(id: string) {
    await this.update(id, { isDeleted: true, updatedBy: 'SYSTEM' });
    return true;
  }

  async deleteUsers(ids: string[]) {
    await this.update(ids, { isDeleted: true, updatedBy: 'SYSTEM' });
    return true;
  }
}
