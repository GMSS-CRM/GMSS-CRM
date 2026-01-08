import { Repository } from 'typeorm';
import { RolePermission } from '../../entities/RolePermission';
import { Permission } from '@gmss/types';

export interface AssignPermissionsInput {
  roleId: string;
  permissions: Permission[];
}

export interface RolePermissionResult {
  roleId: string;
  permissions: Permission[];
}

export interface IRolePermissionRepository extends Repository<RolePermission> {
  findByRoleId(roleId: string): Promise<RolePermission[]>;
  deleteByRoleId(roleId: string): Promise<void>;
  insertPermissions(roleId: string, permissions: Permission[]): Promise<void>;
}

export interface IRolePermissionService {
  getPermissionsByRoleId(roleId: string): Promise<Permission[]>;
  assignPermissions(input: AssignPermissionsInput): Promise<RolePermissionResult>;
}
