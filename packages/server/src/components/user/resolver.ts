import { container } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IUserService } from './types';

export const userResolvers = {
  Query: {
    getUserById: (_: unknown, { id }: { id: string }) =>
      container.get<IUserService>(TYPES.IUserService).getById(id),

    searchUsers: (_: unknown, { searchInput }: any) =>
      container.get<IUserService>(TYPES.IUserService).search(searchInput),
  },

  Mutation: {
    createUser: (_: unknown, { input }: any) =>
      container.get<IUserService>(TYPES.IUserService).create(input),

    updateUser: (_: unknown, { id, input }: any) =>
      container.get<IUserService>(TYPES.IUserService).update(id, input),

    deleteUser: (_: unknown, { id }: any) =>
      container.get<IUserService>(TYPES.IUserService).delete(id),

    deleteUsers: (_: unknown, { ids }: any) =>
      container.get<IUserService>(TYPES.IUserService).deleteMany(ids),
  },
};
