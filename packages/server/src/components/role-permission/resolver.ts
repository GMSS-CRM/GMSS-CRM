import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IRolePermissionService } from './types';
import {
  MutationAssignPermissionsArgs,
  QueryGetPermissionsByRoleIdArgs,
} from '@gmss/types';

const getService = () => {
  const container = getContainer();
  return container.get<IRolePermissionService>(TYPES.IRolePermissionService);
};

export const rolePermissionResolvers = {
  Query: {
    getPermissionsByRoleId: (_: any, { roleId }: QueryGetPermissionsByRoleIdArgs) =>
      getService().getPermissionsByRoleId(roleId),
    getAllPermissions: () =>
      getService().getAllPermissions(),
  },

  Mutation: {
    assignPermissions: (_: any, { input }: MutationAssignPermissionsArgs, context: any) =>
      getService().assignPermissions(input as any),
  },
};
