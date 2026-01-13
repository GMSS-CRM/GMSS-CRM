import { Repository } from 'typeorm';
import { RolePermission } from '../../entities/RolePermission';
import type {
  Permission,
  AssignPermissionsInput,
  RolePermissionResult,
} from '@gmss/types';

export interface IRolePermissionRepository extends Repository<RolePermission> {
  findByRoleId(roleId: string): Promise<RolePermission[]>;
  deleteByRoleId(roleId: string): Promise<void>;
  insertPermissions(entities: Partial<RolePermission>[]): Promise<void>;
}

export interface IRolePermissionService {
  getPermissionsByRoleId(roleId: string): Promise<Permission[]>;
  assignPermissions(input: AssignPermissionsInput): Promise<RolePermissionResult>;
}
