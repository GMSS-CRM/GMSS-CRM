import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IRoleService,
  IRoleRepository,
  CreateRoleInput,
  UpdateRoleInput,
  SearchRoleInput,
} from './types';

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.IRoleRepository)
    private readonly roleRepository: IRoleRepository
  ) {}

  getRoleById(id: string) {
    return this.roleRepository.findById(id);
  }

  searchRoles(input?: SearchRoleInput) {
    return this.roleRepository.search(input);
  }

  createRole(input: CreateRoleInput) {
    return this.roleRepository.createRole(input);
  }

  updateRole(id: string, input: UpdateRoleInput) {
    return this.roleRepository.updateRole(id, input);
  }

  deleteRole(id: string) {
    return this.roleRepository.deleteRole(id);
  }
}
