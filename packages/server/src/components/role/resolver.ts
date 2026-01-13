import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IRoleService } from './types';
import {
  MutationUpdateRoleArgs,
  MutationCreateRoleArgs,
  QueryGetRoleByIdArgs,
  QuerySearchRolesArgs,
} from '@gmss/types';

export const roleResolvers = {
  Query: {
    getRoleById: (_: any, { id }: QueryGetRoleByIdArgs) =>
      getContainer().get<IRoleService>(TYPES.IRoleService).getRoleById(id),

    searchRoles: (_: any, { searchInput }: QuerySearchRolesArgs) =>
      getContainer()
        .get<IRoleService>(TYPES.IRoleService)
        .searchRoles(searchInput as any),
  },

  Mutation: {
    createRole: (_: any, { input }: MutationCreateRoleArgs) =>
      getContainer().get<IRoleService>(TYPES.IRoleService).createRole(input as any),

    updateRole: (_: any, { input }: MutationUpdateRoleArgs) =>
      getContainer().get<IRoleService>(TYPES.IRoleService).updateRole(
        input.id,
        input as any
      ),

    deleteRole: (_: any, { id }: any) =>
      getContainer().get<IRoleService>(TYPES.IRoleService).deleteRole(id),
  },
};
