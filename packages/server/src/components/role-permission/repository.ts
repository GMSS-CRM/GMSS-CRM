import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { RolePermission } from '../../entities/RolePermission';
import { Permission } from '@gmss/types';
import { IRolePermissionRepository } from './types';

@injectable()
export class RolePermissionRepository
  extends Repository<RolePermission>
  implements IRolePermissionRepository
{
  constructor(
    @inject(TYPES.DbContext) private readonly dbContext: DataSource
  ) {
    super(RolePermission, dbContext.manager);
  }

  findByRoleId(roleId: string) {
    return this.find({
      where: { role: { id: roleId } },
      relations: ['role'],
    });
  }

  deleteByRoleId(roleId: string) {
    return this.createQueryBuilder()
      .delete()
      .where('roleId = :roleId', { roleId })
      .execute()
      .then(() => undefined);
  }

  insertPermissions(entities: Partial<RolePermission>[]) {
    return this.save(entities as RolePermission[]).then(() => undefined);
  }
}
