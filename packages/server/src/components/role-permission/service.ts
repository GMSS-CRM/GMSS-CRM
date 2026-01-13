import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Role } from '../../entities/Role';
import { Permission } from '@gmss/types';
import {
 
  IRolePermissionRepository,
  IRolePermissionService,
} from './types';
import { AssignPermissionsInput,
  RolePermissionResult, } from '@gmss/types';

@injectable()
export class RolePermissionService implements IRolePermissionService {
  private roleRepo: any;

  constructor(
    @inject(TYPES.IRolePermissionRepository)
    private readonly rolePermissionRepo: IRolePermissionRepository,
    @inject(TYPES.DbContext)
    private readonly dbContext: DataSource
  ) {
    this.roleRepo = dbContext.getRepository(Role);
  }

  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    const records = await this.rolePermissionRepo.findByRoleId(roleId);
    return records.map((r) => r.permission);
  }

  async assignPermissions(input: AssignPermissionsInput): Promise<RolePermissionResult> {
    const { roleId, permissions } = input;

    // Validate role exists
    const role = await this.roleRepo.findOneBy({ id: roleId });
    if (!role) {
      throw new Error('Provided roleId does not exist');
    }

    // Validate permissions array is not empty
    if (!permissions || permissions.length === 0) {
      throw new Error('At least one permission is required');
    }

    // Delete existing permissions and insert new ones
    await this.rolePermissionRepo.deleteByRoleId(roleId);

    const entities = permissions.map((permission: Permission) => ({
      role,
      permission,
      createdBy: 'SYSTEM',
    }));

    await this.rolePermissionRepo.insertPermissions(entities);

    return {
      id: roleId,
      roleId,
      permissions,
      createdBy: 'SYSTEM',
      createdDate: new Date().toISOString(),
    } as unknown as RolePermissionResult;
  }
}
