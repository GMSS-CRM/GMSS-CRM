import { inject, injectable } from 'inversify';
import { DataSource, Repository, Like } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Role } from '../../entities/Role';
import {
  IRoleRepository,
  CreateRoleInput,
  UpdateRoleInput,
  SearchRoleInput,
} from './types';

@injectable()
export class RoleRepository
  extends Repository<Role>
  implements IRoleRepository
{
  constructor(
    @inject(TYPES.DbContext) private readonly dbContext: DataSource
  ) {
    super(Role, dbContext.manager);
  }

  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  async search(input?: SearchRoleInput) {
    if (!input?.search) {
      return this.find({
        take: input?.limit,
        skip: input?.offset,
      });
    }

    return this.find({
      where: { roleName: Like(`%${input.search}%`) },
      take: input.limit,
      skip: input.offset,
    });
  }

  async createRole(input: CreateRoleInput) {
    const role = this.create({
      ...input,
      updatedBy: 'SYSTEM',
    });
    return this.save(role);
  }

  async updateRole(id: string, input: UpdateRoleInput) {
    await this.update(id, {
      ...input,
      updatedBy: 'SYSTEM',
    });
    return this.findById(id);
  }

  async deleteRole(id: string) {
    await this.delete(id);
    return true;
  }
}
