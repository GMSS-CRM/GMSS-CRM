import { userService } from "./service";

export const userResolvers = {
  Query: {
    getUserById: (_: any, { id }: any) => userService.getById(id),
    searchUsers: (_: any, args: any) => userService.search(args),
  },

  Mutation: {
    createUser: (_: any, { input }: any) => userService.create(input),
    updateUser: (_: any, { id, input }: any) =>
      userService.update(id, input),
    deleteUser: (_: any, { id }: any) => userService.delete(id),
    deleteUsers: (_: any, { ids }: any) => userService.deleteMany(ids),
  },
};
