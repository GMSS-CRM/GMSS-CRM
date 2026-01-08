import { container } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IRoleService } from './types';

export const roleResolvers = {
  Query: {
    roleById: (_: any, { id }: any) =>
      container.get<IRoleService>(TYPES.IRoleService).getRoleById(id),

    searchRoles: (_: any, { searchInput }: any) =>
      container
        .get<IRoleService>(TYPES.IRoleService)
        .searchRoles(searchInput),
  },

  Mutation: {
    createRole: (_: any, { input }: any) =>
      container.get<IRoleService>(TYPES.IRoleService).createRole(input),

    updateRole: (_: any, { input }: any) =>
      container.get<IRoleService>(TYPES.IRoleService).updateRole(
        input.id,
        input
      ),

    deleteRole: (_: any, { id }: any) =>
      container.get<IRoleService>(TYPES.IRoleService).deleteRole(id),
  },
};
