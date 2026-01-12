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

  search(input: { search?: string; limit?: number; offset?: number }) {
    const where: any = {};
    if (input.search) {
      where.name = Like(`%${input.search}%`);
    }
    return this.find({
      where,
      take: input.limit,
      skip: input.offset,
    });
  }

  createRole(role: Partial<Role>) {
    return this.save(this.create(role));
  }

  updateRole(id: string, role: Partial<Role>) {
    return this.update(id, role).then(() => this.findById(id));
  }

  deleteRole(id: string) {
    return this.delete(id);
  }
}
