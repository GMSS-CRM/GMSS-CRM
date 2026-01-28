import { Repository } from 'typeorm';
import { Role } from '../../entities/Role';
import type {
  CreateRoleInput,
  UpdateRoleInput,
  SearchRoleInput,
} from '@gmss/types';


/*export interface SaveRoleResponse {
  roles?: Role[];
  deletedIds?: string[];
  errors?: string[];
}*/

export interface IRoleRepository extends Repository<Role> {
  findById(id: string): Promise<Role | null>;
  search(input: { search?: string; limit?: number; offset?: number }): Promise<Role[]>;
  createRole(role: Partial<Role>): Promise<Role>;
  updateRole(id: string, role: Partial<Role>): Promise<Role | null>;
  deleteRole(id: string): Promise<any>;
}

export interface IRoleService {
  getRoleById(id: string): Promise<Role | null>;
  searchRoles(input?: SearchRoleInput): Promise<Role[]>;
  createRole(input: CreateRoleInput, context?: { email?: string }): Promise<Role>;
  updateRole(id: string, input: UpdateRoleInput, context?: { email?: string }): Promise<Role | null>;
  deleteRole(id: string): Promise<boolean>;
}
