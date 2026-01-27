import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IRoleService,
  IRoleRepository,
} from './types';
import {
  CreateRoleInput,
  UpdateRoleInput,
  SearchRoleInput,
} from '@gmss/types';
import ErrorInfo from '../common/error-info';

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.IRoleRepository)
    private readonly roleRepository: IRoleRepository
  ) { }

  getRoleById(id: string) {
    return this.roleRepository.findById(id);
  }

  searchRoles(input?: SearchRoleInput) {
    const searchInput = {
      search: input?.search ?? undefined,
      limit: input?.limit ?? undefined,
      offset: input?.offset ?? undefined,
    };
    return this.roleRepository.search(searchInput);
  }

  createRole(input: CreateRoleInput, actor?: { email?: string }) {
    if (!input.name || input.name.trim() === '') {
      throw new Error(ErrorInfo.ROLE_NAME_REQUIRED);
    }

    return this.roleRepository.createRole({
      name: input.name,
      description: input.description ?? undefined,
      createdBy: actor?.email ?? 'SYSTEM',
      updatedBy: actor?.email ?? 'SYSTEM',
    });
  }

  updateRole(id: string, input: UpdateRoleInput, actor?: { email?: string }) {
    const updateData: any = { updatedBy: actor?.email ?? 'SYSTEM' };

    if (input.name !== null && input.name !== undefined && input.name.trim() !== '') {
      updateData.name = input.name;
    }

    if (input.description !== null && input.description !== undefined) {
      updateData.description = input.description;
    }

    return this.roleRepository.updateRole(id, updateData);
  }

  deleteRole(id: string) {
    return this.roleRepository.deleteRole(id).then(() => true);
  }
}
