import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { Permission } from '@gmss/types';
import {
  AssignPermissionsInput,
  IRolePermissionRepository,
  IRolePermissionService,
} from './types';

@injectable()
export class RolePermissionService implements IRolePermissionService {
  constructor(
    @inject(TYPES.IRolePermissionRepository)
    private readonly rolePermissionRepo: IRolePermissionRepository
  ) {}

  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    const records = await this.rolePermissionRepo.findByRoleId(roleId);
    return records.map((r) => r.permission);
  }

  async assignPermissions(input: AssignPermissionsInput) {
    const { roleId, permissions } = input;

    await this.rolePermissionRepo.deleteByRoleId(roleId);
    await this.rolePermissionRepo.insertPermissions(roleId, permissions);

    return {
      roleId,
      permissions,
    };
  }
}
