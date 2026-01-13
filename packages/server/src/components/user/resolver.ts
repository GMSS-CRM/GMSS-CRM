import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IUserService } from './types';
import {
  QueryGetUserByIdArgs,
  QuerySearchUsersArgs,
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
} from '@gmss/types';

export const userResolvers = {
  Query: {
    getUserById: (_: unknown, { id }: QueryGetUserByIdArgs) =>
      getContainer().get<IUserService>(TYPES.IUserService).getUserById(id),

    searchUsers: (_: unknown, { searchInput }: QuerySearchUsersArgs) =>
      getContainer().get<IUserService>(TYPES.IUserService).searchUser(searchInput as any),
  },

  Mutation: {
    createUser: (_: unknown, { input }: MutationCreateUserArgs) =>
      getContainer().get<IUserService>(TYPES.IUserService).createUser(input as any),

    updateUser: (_: unknown, { id, input }: MutationUpdateUserArgs) =>
      getContainer().get<IUserService>(TYPES.IUserService).updateUser(id, input as any),

    deleteUser: (_: unknown, { id }: any) =>
      getContainer().get<IUserService>(TYPES.IUserService).deleteUser(id),

    deleteUsers: (_: unknown, { ids }: any) =>
      getContainer().get<IUserService>(TYPES.IUserService).deleteUsers(ids),
  },

  User: {
    role: (parent: any) => parent.role || null,
    roleId: (parent: any) => parent.role?.id ?? parent.roleId,
  },
};
