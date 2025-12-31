import { roleService } from "./service";

export const roleResolvers = {
  Query: {
    getRoleById: (_: any, { id }: any) =>
      roleService.getById(id),

    searchRoles: (_: any, { search }: any) =>
      roleService.search(search),
  },

  Mutation: {
    createRole: (_: any, { input }: any) =>
      roleService.create(input),

    updateRole: (_: any, { id, input }: any) =>
      roleService.update(id, input),

    deleteRole: (_: any, { id }: any) =>
      roleService.delete(id),
  },
};
