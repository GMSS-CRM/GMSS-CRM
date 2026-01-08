import { container } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IRolePermissionService } from './types';

export const rolePermissionResolvers = {
  Query: {
    permissionsByRoleId: (_: any, { roleId }: any) =>
      container
        .get<IRolePermissionService>(TYPES.IRolePermissionService)
        .getPermissionsByRoleId(roleId),
  },

  Mutation: {
    assignPermissions: (_: any, { input }: any) =>
      container
        .get<IRolePermissionService>(TYPES.IRolePermissionService)
        .assignPermissions(input),
  },
};
