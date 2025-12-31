// src/components/user/resolver.ts
import { userService } from "./service";
import { AppDataSource } from "../../config/data-source";
import { Role } from "../../entities/Role";

const roleRepo = AppDataSource.getRepository(Role);

export const userResolvers = {
  Query: {
    getUserById: (_: any, { id }: any) => userService.getById(id),
    searchUsers: (_: any, args: any) => userService.search(args),
  },

  Mutation: {
    createUser: (_: any, { input }: any) =>
      userService.create(input),

    updateUser: (_: any, { id, input }: any) =>
      userService.update(id, input),

    deleteUser: (_: any, { id }: any) =>
      userService.delete(id),

    deleteUsers: (_: any, { ids }: any) =>
      userService.deleteMany(ids),
  },

  User: {
    role: (user: any) => {
      if (!user.roleId) return null;
      return roleRepo.findOne({ where: { id: user.roleId } });
    },
  },
};
