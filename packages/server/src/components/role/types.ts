import { Repository } from 'typeorm';
import { Role } from '../../entities/Role';

export interface CreateRoleInput {
  roleName: string;
  description?: string;
}

export interface UpdateRoleInput {
  id: string;
  roleName?: string;
  description?: string;
}

export interface SearchRoleInput {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface SaveRoleResponse {
  roles?: Role[];
  deletedIds?: string[];
  errors?: string[];
}

export interface IRoleRepository extends Repository<Role> {
  findById(id: string): Promise<Role | null>;
  search(input?: SearchRoleInput): Promise<Role[]>;
  createRole(input: CreateRoleInput): Promise<Role>;
  updateRole(id: string, input: UpdateRoleInput): Promise<Role | null>;
  deleteRole(id: string): Promise<boolean>;
}

export interface IRoleService {
  getRoleById(id: string): Promise<Role | null>;
  searchRoles(input?: SearchRoleInput): Promise<Role[]>;
  createRole(input: CreateRoleInput): Promise<Role>;
  updateRole(id: string, input: UpdateRoleInput): Promise<Role | null>;
  deleteRole(id: string): Promise<boolean>;
}
