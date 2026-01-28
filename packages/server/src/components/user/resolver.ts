import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IUserService } from './types';
import {
  QueryGetUserByIdArgs,
  QuerySearchUsersArgs,
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
} from '@gmss/types';

const getService = () => {
  const container = getContainer();
  return container.get<IUserService>(TYPES.IUserService);
};

export const userResolvers = {
  Query: {
    getUserById: (_: unknown, { id }: QueryGetUserByIdArgs) => getService().getUserById(id),

    searchUsers: (_: unknown, { searchInput }: QuerySearchUsersArgs) =>
      getService().searchUser(searchInput as any),
  },

  Mutation: {
    createUser: (_: unknown, { input }: MutationCreateUserArgs, context: any) =>
      getService().createUser(input as any, { email: context?.user?.email, roleId: context?.user?.role?.id, roleName: context?.user?.role?.name }),

    updateUser: (_: unknown, { id, input }: MutationUpdateUserArgs, context: any) =>
      getService().updateUser(id, input as any),

    deleteUser: (_: unknown, { id }: any) => getService().deleteUser(id),

    deleteUsers: (_: unknown, { ids }: any) => getService().deleteUsers(ids),
  },

  User: {
    role: (parent: any) => parent.role || null,
    roleId: (parent: any) => parent.role?.id ?? parent.roleId,
  },
};
