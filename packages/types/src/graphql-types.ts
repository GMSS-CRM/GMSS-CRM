import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: any; output: any; }
};

export type AssignPermissionsInput = {
  permissions: Array<Permission>;
  roleId: Scalars['ID']['input'];
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignPermissions: RolePermissionResult;
  createRole: Role;
  createUser: User;
  deleteRole: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  deleteUsers: Scalars['Boolean']['output'];
  updateRole: Role;
  updateUser: User;
};


export type MutationAssignPermissionsArgs = {
  input: AssignPermissionsInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export enum Permission {
  CREATE_ROLE = 'CREATE_ROLE',
  CREATE_USER = 'CREATE_USER',
  DELETE_ROLE = 'DELETE_ROLE',
  DELETE_USER = 'DELETE_USER',
  READ_APP_SETTING = 'READ_APP_SETTING',
  READ_ROLE = 'READ_ROLE',
  READ_USER = 'READ_USER',
  UPDATE_APP_SETTING = 'UPDATE_APP_SETTING',
  UPDATE_ROLE = 'UPDATE_ROLE',
  UPDATE_USER = 'UPDATE_USER'
}

export type Query = {
  __typename?: 'Query';
  getPermissionsByRoleId: Array<Permission>;
  getRoleById?: Maybe<Role>;
  getUserById?: Maybe<User>;
  searchRoles: Array<Role>;
  searchUsers: Array<User>;
};


export type QueryGetPermissionsByRoleIdArgs = {
  roleId: Scalars['ID']['input'];
};


export type QueryGetRoleByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchRolesArgs = {
  searchInput?: InputMaybe<SearchRoleInput>;
};


export type QuerySearchUsersArgs = {
  searchInput?: InputMaybe<SearchUserInput>;
};

export type Role = {
  __typename?: 'Role';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedBy: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};

export type RolePermissionResult = {
  __typename?: 'RolePermissionResult';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  permissions: Array<Permission>;
  roleId: Scalars['ID']['output'];
};

export type SearchRoleInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchUserInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  role: Role;
  roleId: Scalars['ID']['output'];
  updatedBy: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AssignPermissionsInput: AssignPermissionsInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  CreateRoleInput: CreateRoleInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  CreateUserInput: CreateUserInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Permission: Permission;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Role: ResolverTypeWrapper<Role>;
  RolePermissionResult: ResolverTypeWrapper<RolePermissionResult>;
  SearchRoleInput: SearchRoleInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  SearchUserInput: SearchUserInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssignPermissionsInput: AssignPermissionsInput;
  ID: Scalars['ID']['output'];
  CreateRoleInput: CreateRoleInput;
  String: Scalars['String']['output'];
  CreateUserInput: CreateUserInput;
  Mutation: Record<PropertyKey, never>;
  Boolean: Scalars['Boolean']['output'];
  Query: Record<PropertyKey, never>;
  Role: Role;
  RolePermissionResult: RolePermissionResult;
  SearchRoleInput: SearchRoleInput;
  Int: Scalars['Int']['output'];
  SearchUserInput: SearchUserInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignPermissions?: Resolver<ResolversTypes['RolePermissionResult'], ParentType, ContextType, RequireFields<MutationAssignPermissionsArgs, 'input'>>;
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteUsers?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUsersArgs, 'ids'>>;
  updateRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getPermissionsByRoleId?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType, RequireFields<QueryGetPermissionsByRoleIdArgs, 'roleId'>>;
  getRoleById?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryGetRoleByIdArgs, 'id'>>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
  searchRoles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, Partial<QuerySearchRolesArgs>>;
  searchUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QuerySearchUsersArgs>>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RolePermissionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RolePermissionResult'] = ResolversParentTypes['RolePermissionResult']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  roleId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  roleId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RolePermissionResult?: RolePermissionResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

