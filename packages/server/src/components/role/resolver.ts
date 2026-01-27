import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IRoleService } from './types';
import {
  MutationUpdateRoleArgs,
  MutationCreateRoleArgs,
  QueryGetRoleByIdArgs,
  QuerySearchRolesArgs,
} from '@gmss/types';

const getService = () => {
  const container = getContainer();
  return container.get<IRoleService>(TYPES.IRoleService);
};

export const roleResolvers = {
  Query: {
    getRoleById: (_: any, { id }: QueryGetRoleByIdArgs) => getService().getRoleById(id),

    searchRoles: (_: any, { searchInput }: QuerySearchRolesArgs) =>
      getService().searchRoles(searchInput as any),
  },

  Mutation: {
    createRole: (_: any, { input }: MutationCreateRoleArgs, context: any) =>
      getService().createRole(input as any, { email: context?.user?.email }),

    updateRole: (_: any, { input }: MutationUpdateRoleArgs, context: any) =>
      getService().updateRole(input.id, input as any, { email: context?.user?.email }),

    deleteRole: (_: any, { id }: any) => getService().deleteRole(id),
  },
};
