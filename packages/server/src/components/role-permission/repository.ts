import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { RolePermission } from '../../entities/RolePermission';
import { Role } from '../../entities/Role';
import { Permission } from '@gmss/types';
import { IRolePermissionRepository } from './types';

@injectable()
export class RolePermissionRepository
  extends Repository<RolePermission>
  implements IRolePermissionRepository
{
  private roleRepo: Repository<Role>;

  constructor(
    @inject(TYPES.DbContext) private readonly dbContext: DataSource
  ) {
    super(RolePermission, dbContext.manager);
    this.roleRepo = dbContext.getRepository(Role);
  }

  findByRoleId(roleId: string) {
    return this.find({
      where: { role: { id: roleId } },
      relations: ['role'],
    });
  }

  async deleteByRoleId(roleId: string) {
    await this.createQueryBuilder()
      .delete()
      .where('roleId = :roleId', { roleId })
      .execute();
  }

  async insertPermissions(roleId: string, permissions: Permission[]) {
    const role = await this.roleRepo.findOneBy({ id: roleId });
    if (!role) throw new Error('Invalid roleId');

    const entities = permissions.map((permission) =>
      this.create({
        role,
        permission,
        updatedBy: 'SYSTEM',
      })
    );

    await this.save(entities);
  }
}
