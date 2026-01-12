import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IRolePermissionService } from './types';
import {
  MutationAssignPermissionsArgs,
  QueryGetPermissionsByRoleIdArgs,
} from '@gmss/types';

export const rolePermissionResolvers = {
  Query: {
    getPermissionsByRoleId: (_: any, { roleId }: QueryGetPermissionsByRoleIdArgs) =>
      getContainer()
        .get<IRolePermissionService>(TYPES.IRolePermissionService)
        .getPermissionsByRoleId(roleId),
  },

  Mutation: {
    assignPermissions: (_: any, { input }: MutationAssignPermissionsArgs) =>
      getContainer()
        .get<IRolePermissionService>(TYPES.IRolePermissionService)
        .assignPermissions(input as any),
  },
};
