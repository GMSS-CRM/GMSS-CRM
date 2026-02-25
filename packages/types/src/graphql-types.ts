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

export enum CompanyType {
  Deleted = 'Deleted',
  Final = 'Final',
  Interested = 'Interested',
  New = 'New',
  NotInterested = 'NotInterested'
}

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTagInput = {
  name: Scalars['String']['input'];
};

export type CreateTenderDocumentInput = {
  documentName: Scalars['String']['input'];
  documentUrl: Scalars['String']['input'];
  expiresOn?: InputMaybe<Scalars['String']['input']>;
  tenderId: Scalars['ID']['input'];
};

export type CreateTenderInput = {
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateVendorContactPersonInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  cc?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorDocumentInput = {
  documentName: Scalars['String']['input'];
  documentUrl: Scalars['String']['input'];
  expiresOn?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  cinNumber?: InputMaybe<Scalars['String']['input']>;
  gstNumber?: InputMaybe<Scalars['String']['input']>;
  msmeUdyamNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  panNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CompanyType>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorTagInput = {
  enableMail?: InputMaybe<Scalars['Boolean']['input']>;
  tagId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignPermissions: RolePermissionResult;
  createRole: Role;
  createTag: Tag;
  createTender: Tender;
  createTenderDocument: TenderDocument;
  createUser: User;
  createVendor: Vendor;
  createVendorContactPerson: VendorContactPerson;
  createVendorDocument: VendorDocument;
  createVendorTag: VendorTag;
  deleteRole: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  deleteTags: Scalars['Boolean']['output'];
  deleteTender: Scalars['Boolean']['output'];
  deleteTenderDocument: Scalars['Boolean']['output'];
  deleteTenderDocuments: Scalars['Boolean']['output'];
  deleteTenders: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  deleteUsers: Scalars['Boolean']['output'];
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorContactPerson: Scalars['Boolean']['output'];
  deleteVendorContactPersons: Scalars['Boolean']['output'];
  deleteVendorDocument: Scalars['Boolean']['output'];
  deleteVendorDocuments: Scalars['Boolean']['output'];
  deleteVendorTag: Scalars['Boolean']['output'];
  deleteVendors: Scalars['Boolean']['output'];
  updateRole: Role;
  updateTag: Tag;
  updateTender: Tender;
  updateTenderDocument: TenderDocument;
  updateUser: User;
  updateVendor: Vendor;
  updateVendorContactPerson: VendorContactPerson;
  updateVendorDocument: VendorDocument;
  uploadVendor: Vendor;
};


export type MutationAssignPermissionsArgs = {
  input: AssignPermissionsInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTenderArgs = {
  input: CreateTenderInput;
};


export type MutationCreateTenderDocumentArgs = {
  input: CreateTenderDocumentInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


export type MutationCreateVendorContactPersonArgs = {
  input: CreateVendorContactPersonInput;
};


export type MutationCreateVendorDocumentArgs = {
  input: CreateVendorDocumentInput;
};


export type MutationCreateVendorTagArgs = {
  input: CreateVendorTagInput;
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTenderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTenderDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTenderDocumentsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTendersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorContactPersonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorContactPersonsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteVendorDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorDocumentsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteVendorTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTagInput;
};


export type MutationUpdateTenderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTenderInput;
};


export type MutationUpdateTenderDocumentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTenderDocumentInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateVendorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
};


export type MutationUpdateVendorContactPersonArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorContactPersonInput;
};


export type MutationUpdateVendorDocumentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorDocumentInput;
};


export type MutationUploadVendorArgs = {
  input: CreateVendorInput;
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
  getTagById?: Maybe<Tag>;
  getTenderById?: Maybe<Tender>;
  getTenderDocumentById?: Maybe<TenderDocument>;
  getUserById?: Maybe<User>;
  getVendorById?: Maybe<Vendor>;
  getVendorContactPersonById?: Maybe<VendorContactPerson>;
  getVendorDocumentById?: Maybe<VendorDocument>;
  getVendorsByTag: Array<Vendor>;
  searchRoles: Array<Role>;
  searchTags: Array<Tag>;
  searchTenderDocuments: Array<TenderDocument>;
  searchTenders: Array<Tender>;
  searchUsers: Array<User>;
  searchVendorContactPersons: Array<VendorContactPerson>;
  searchVendorDocuments: Array<VendorDocument>;
  searchVendors: Array<Vendor>;
};


export type QueryGetPermissionsByRoleIdArgs = {
  roleId: Scalars['ID']['input'];
};


export type QueryGetRoleByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTagByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTenderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTenderDocumentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorContactPersonByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorDocumentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorsByTagArgs = {
  tagId: Scalars['ID']['input'];
};


export type QuerySearchRolesArgs = {
  searchInput?: InputMaybe<SearchRoleInput>;
};


export type QuerySearchTagsArgs = {
  searchInput?: InputMaybe<SearchTagInput>;
};


export type QuerySearchTenderDocumentsArgs = {
  searchInput?: InputMaybe<SearchTenderDocumentInput>;
};


export type QuerySearchTendersArgs = {
  searchInput?: InputMaybe<SearchTenderInput>;
};


export type QuerySearchUsersArgs = {
  searchInput?: InputMaybe<SearchUserInput>;
};


export type QuerySearchVendorContactPersonsArgs = {
  searchInput?: InputMaybe<SearchVendorContactPersonInput>;
};


export type QuerySearchVendorDocumentsArgs = {
  searchInput?: InputMaybe<SearchVendorDocumentInput>;
};


export type QuerySearchVendorsArgs = {
  searchInput?: InputMaybe<SearchVendorInput>;
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

export type SearchTagInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchTenderDocumentInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tenderId?: InputMaybe<Scalars['ID']['input']>;
};

export type SearchTenderInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchUserInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchVendorContactPersonInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type SearchVendorDocumentInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type SearchVendorInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CompanyType>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Tag = {
  __typename?: 'Tag';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
};

export type Tender = {
  __typename?: 'Tender';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documents?: Maybe<Array<TenderDocument>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  tags?: Maybe<Array<TenderTag>>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
};

export type TenderDocument = {
  __typename?: 'TenderDocument';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documentName: Scalars['String']['output'];
  documentUrl: Scalars['String']['output'];
  expiresOn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  tenderId: Scalars['ID']['output'];
};

export type TenderTag = {
  __typename?: 'TenderTag';
  id: Scalars['ID']['output'];
  tag?: Maybe<Tag>;
  tagId: Scalars['ID']['output'];
  tenderId: Scalars['ID']['output'];
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTagInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenderDocumentInput = {
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  expiresOn?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenderInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateVendorContactPersonInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  cc?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateVendorDocumentInput = {
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  expiresOn?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  cinNumber?: InputMaybe<Scalars['String']['input']>;
  gstNumber?: InputMaybe<Scalars['String']['input']>;
  msmeUdyamNumber?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  panNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CompanyType>;
  type?: InputMaybe<Scalars['String']['input']>;
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
  roleId?: Maybe<Scalars['ID']['output']>;
  updatedBy: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};

export type Vendor = {
  __typename?: 'Vendor';
  address?: Maybe<Scalars['String']['output']>;
  cinNumber?: Maybe<Scalars['String']['output']>;
  contactPersons?: Maybe<Array<VendorContactPerson>>;
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documents?: Maybe<Array<VendorDocument>>;
  gstNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  msmeUdyamNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  panNumber?: Maybe<Scalars['String']['output']>;
  status: CompanyType;
  tags?: Maybe<Array<VendorTag>>;
  type?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
};

export type VendorContactPerson = {
  __typename?: 'VendorContactPerson';
  bcc?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Scalars['String']['output']>>;
  cc?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  designation?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorDocument = {
  __typename?: 'VendorDocument';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documentName: Scalars['String']['output'];
  documentUrl: Scalars['String']['output'];
  expiresOn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorTag = {
  __typename?: 'VendorTag';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  enableMail: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  tag?: Maybe<Tag>;
  tagId: Scalars['ID']['output'];
  vendorId: Scalars['ID']['output'];
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
  CompanyType: CompanyType;
  CreateRoleInput: CreateRoleInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  CreateTagInput: CreateTagInput;
  CreateTenderDocumentInput: CreateTenderDocumentInput;
  CreateTenderInput: CreateTenderInput;
  CreateUserInput: CreateUserInput;
  CreateVendorContactPersonInput: CreateVendorContactPersonInput;
  CreateVendorDocumentInput: CreateVendorDocumentInput;
  CreateVendorInput: CreateVendorInput;
  CreateVendorTagInput: CreateVendorTagInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Permission: Permission;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Role: ResolverTypeWrapper<Role>;
  RolePermissionResult: ResolverTypeWrapper<RolePermissionResult>;
  SearchRoleInput: SearchRoleInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  SearchTagInput: SearchTagInput;
  SearchTenderDocumentInput: SearchTenderDocumentInput;
  SearchTenderInput: SearchTenderInput;
  SearchUserInput: SearchUserInput;
  SearchVendorContactPersonInput: SearchVendorContactPersonInput;
  SearchVendorDocumentInput: SearchVendorDocumentInput;
  SearchVendorInput: SearchVendorInput;
  Tag: ResolverTypeWrapper<Tag>;
  Tender: ResolverTypeWrapper<Tender>;
  TenderDocument: ResolverTypeWrapper<TenderDocument>;
  TenderTag: ResolverTypeWrapper<TenderTag>;
  UpdateRoleInput: UpdateRoleInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTenderDocumentInput: UpdateTenderDocumentInput;
  UpdateTenderInput: UpdateTenderInput;
  UpdateUserInput: UpdateUserInput;
  UpdateVendorContactPersonInput: UpdateVendorContactPersonInput;
  UpdateVendorDocumentInput: UpdateVendorDocumentInput;
  UpdateVendorInput: UpdateVendorInput;
  User: ResolverTypeWrapper<User>;
  Vendor: ResolverTypeWrapper<Vendor>;
  VendorContactPerson: ResolverTypeWrapper<VendorContactPerson>;
  VendorDocument: ResolverTypeWrapper<VendorDocument>;
  VendorTag: ResolverTypeWrapper<VendorTag>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssignPermissionsInput: AssignPermissionsInput;
  ID: Scalars['ID']['output'];
  CreateRoleInput: CreateRoleInput;
  String: Scalars['String']['output'];
  CreateTagInput: CreateTagInput;
  CreateTenderDocumentInput: CreateTenderDocumentInput;
  CreateTenderInput: CreateTenderInput;
  CreateUserInput: CreateUserInput;
  CreateVendorContactPersonInput: CreateVendorContactPersonInput;
  CreateVendorDocumentInput: CreateVendorDocumentInput;
  CreateVendorInput: CreateVendorInput;
  CreateVendorTagInput: CreateVendorTagInput;
  Boolean: Scalars['Boolean']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  Role: Role;
  RolePermissionResult: RolePermissionResult;
  SearchRoleInput: SearchRoleInput;
  Int: Scalars['Int']['output'];
  SearchTagInput: SearchTagInput;
  SearchTenderDocumentInput: SearchTenderDocumentInput;
  SearchTenderInput: SearchTenderInput;
  SearchUserInput: SearchUserInput;
  SearchVendorContactPersonInput: SearchVendorContactPersonInput;
  SearchVendorDocumentInput: SearchVendorDocumentInput;
  SearchVendorInput: SearchVendorInput;
  Tag: Tag;
  Tender: Tender;
  TenderDocument: TenderDocument;
  TenderTag: TenderTag;
  UpdateRoleInput: UpdateRoleInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTenderDocumentInput: UpdateTenderDocumentInput;
  UpdateTenderInput: UpdateTenderInput;
  UpdateUserInput: UpdateUserInput;
  UpdateVendorContactPersonInput: UpdateVendorContactPersonInput;
  UpdateVendorDocumentInput: UpdateVendorDocumentInput;
  UpdateVendorInput: UpdateVendorInput;
  User: User;
  Vendor: Vendor;
  VendorContactPerson: VendorContactPerson;
  VendorDocument: VendorDocument;
  VendorTag: VendorTag;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignPermissions?: Resolver<ResolversTypes['RolePermissionResult'], ParentType, ContextType, RequireFields<MutationAssignPermissionsArgs, 'input'>>;
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'input'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  createTender?: Resolver<ResolversTypes['Tender'], ParentType, ContextType, RequireFields<MutationCreateTenderArgs, 'input'>>;
  createTenderDocument?: Resolver<ResolversTypes['TenderDocument'], ParentType, ContextType, RequireFields<MutationCreateTenderDocumentArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVendor?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'input'>>;
  createVendorContactPerson?: Resolver<ResolversTypes['VendorContactPerson'], ParentType, ContextType, RequireFields<MutationCreateVendorContactPersonArgs, 'input'>>;
  createVendorDocument?: Resolver<ResolversTypes['VendorDocument'], ParentType, ContextType, RequireFields<MutationCreateVendorDocumentArgs, 'input'>>;
  createVendorTag?: Resolver<ResolversTypes['VendorTag'], ParentType, ContextType, RequireFields<MutationCreateVendorTagArgs, 'input'>>;
  deleteRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  deleteTags?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagsArgs, 'ids'>>;
  deleteTender?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenderArgs, 'id'>>;
  deleteTenderDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenderDocumentArgs, 'id'>>;
  deleteTenderDocuments?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenderDocumentsArgs, 'ids'>>;
  deleteTenders?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTendersArgs, 'ids'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteUsers?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUsersArgs, 'ids'>>;
  deleteVendor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorArgs, 'id'>>;
  deleteVendorContactPerson?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorContactPersonArgs, 'id'>>;
  deleteVendorContactPersons?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorContactPersonsArgs, 'ids'>>;
  deleteVendorDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorDocumentArgs, 'id'>>;
  deleteVendorDocuments?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorDocumentsArgs, 'ids'>>;
  deleteVendorTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorTagArgs, 'id'>>;
  deleteVendors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorsArgs, 'ids'>>;
  updateRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'input'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'id' | 'input'>>;
  updateTender?: Resolver<ResolversTypes['Tender'], ParentType, ContextType, RequireFields<MutationUpdateTenderArgs, 'id' | 'input'>>;
  updateTenderDocument?: Resolver<ResolversTypes['TenderDocument'], ParentType, ContextType, RequireFields<MutationUpdateTenderDocumentArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
  updateVendor?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationUpdateVendorArgs, 'id' | 'input'>>;
  updateVendorContactPerson?: Resolver<ResolversTypes['VendorContactPerson'], ParentType, ContextType, RequireFields<MutationUpdateVendorContactPersonArgs, 'id' | 'input'>>;
  updateVendorDocument?: Resolver<ResolversTypes['VendorDocument'], ParentType, ContextType, RequireFields<MutationUpdateVendorDocumentArgs, 'id' | 'input'>>;
  uploadVendor?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationUploadVendorArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getPermissionsByRoleId?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType, RequireFields<QueryGetPermissionsByRoleIdArgs, 'roleId'>>;
  getRoleById?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryGetRoleByIdArgs, 'id'>>;
  getTagById?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryGetTagByIdArgs, 'id'>>;
  getTenderById?: Resolver<Maybe<ResolversTypes['Tender']>, ParentType, ContextType, RequireFields<QueryGetTenderByIdArgs, 'id'>>;
  getTenderDocumentById?: Resolver<Maybe<ResolversTypes['TenderDocument']>, ParentType, ContextType, RequireFields<QueryGetTenderDocumentByIdArgs, 'id'>>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
  getVendorById?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryGetVendorByIdArgs, 'id'>>;
  getVendorContactPersonById?: Resolver<Maybe<ResolversTypes['VendorContactPerson']>, ParentType, ContextType, RequireFields<QueryGetVendorContactPersonByIdArgs, 'id'>>;
  getVendorDocumentById?: Resolver<Maybe<ResolversTypes['VendorDocument']>, ParentType, ContextType, RequireFields<QueryGetVendorDocumentByIdArgs, 'id'>>;
  getVendorsByTag?: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryGetVendorsByTagArgs, 'tagId'>>;
  searchRoles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, Partial<QuerySearchRolesArgs>>;
  searchTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, Partial<QuerySearchTagsArgs>>;
  searchTenderDocuments?: Resolver<Array<ResolversTypes['TenderDocument']>, ParentType, ContextType, Partial<QuerySearchTenderDocumentsArgs>>;
  searchTenders?: Resolver<Array<ResolversTypes['Tender']>, ParentType, ContextType, Partial<QuerySearchTendersArgs>>;
  searchUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QuerySearchUsersArgs>>;
  searchVendorContactPersons?: Resolver<Array<ResolversTypes['VendorContactPerson']>, ParentType, ContextType, Partial<QuerySearchVendorContactPersonsArgs>>;
  searchVendorDocuments?: Resolver<Array<ResolversTypes['VendorDocument']>, ParentType, ContextType, Partial<QuerySearchVendorDocumentsArgs>>;
  searchVendors?: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType, Partial<QuerySearchVendorsArgs>>;
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

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TenderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tender'] = ResolversParentTypes['Tender']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<ResolversTypes['TenderDocument']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['TenderTag']>>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TenderDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['TenderDocument'] = ResolversParentTypes['TenderDocument']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresOn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tenderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type TenderTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['TenderTag'] = ResolversParentTypes['TenderTag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tenderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  roleId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type VendorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vendor'] = ResolversParentTypes['Vendor']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cinNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactPersons?: Resolver<Maybe<Array<ResolversTypes['VendorContactPerson']>>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<ResolversTypes['VendorDocument']>>, ParentType, ContextType>;
  gstNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  msmeUdyamNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  panNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['CompanyType'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['VendorTag']>>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type VendorContactPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorContactPerson'] = ResolversParentTypes['VendorContactPerson']> = {
  bcc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  categories?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  cc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  designation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorDocument'] = ResolversParentTypes['VendorDocument']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresOn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorTag'] = ResolversParentTypes['VendorTag']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enableMail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RolePermissionResult?: RolePermissionResultResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  Tender?: TenderResolvers<ContextType>;
  TenderDocument?: TenderDocumentResolvers<ContextType>;
  TenderTag?: TenderTagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vendor?: VendorResolvers<ContextType>;
  VendorContactPerson?: VendorContactPersonResolvers<ContextType>;
  VendorDocument?: VendorDocumentResolvers<ContextType>;
  VendorTag?: VendorTagResolvers<ContextType>;
};

