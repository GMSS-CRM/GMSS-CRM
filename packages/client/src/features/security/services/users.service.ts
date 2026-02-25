import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  SearchUserInput,
} from '@gmss/types';

// ─── Fragments ────────────────────────────────────────────────────────────────

const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    firstName
    lastName
    email
    roleId
    role {
      id
      name
    }
    createdBy
    createdDate
    updatedBy
    updatedDate
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const SEARCH_USERS = gql`
  ${USER_FIELDS}
  query SearchUsers($searchInput: SearchUserInput) {
    searchUsers(searchInput: $searchInput) {
      ...UserFields
    }
  }
`;

export const GET_USER_BY_ID = gql`
  ${USER_FIELDS}
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      ...UserFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_USER = gql`
  ${USER_FIELDS}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`;

export const UPDATE_USER = gql`
  ${USER_FIELDS}
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const DELETE_USERS = gql`
  mutation DeleteUsers($ids: [ID!]!) {
    deleteUsers(ids: $ids)
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useSearchUsers = (searchInput?: SearchUserInput) =>
  useQuery<{ searchUsers: User[] }>(SEARCH_USERS, {
    variables: { searchInput },
    fetchPolicy: 'cache-and-network',
  });

export const useGetUserById = (id: string) =>
  useQuery<{ getUserById: User | null }>(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });

export const useCreateUser = () =>
  useMutation<{ createUser: User }, { input: CreateUserInput }>(CREATE_USER, {
    refetchQueries: [{ query: SEARCH_USERS }],
  });

export const useUpdateUser = () =>
  useMutation<{ updateUser: User }, { id: string; input: UpdateUserInput }>(UPDATE_USER, {
    refetchQueries: [{ query: SEARCH_USERS }],
  });

export const useDeleteUser = () =>
  useMutation<{ deleteUser: boolean }, { id: string }>(DELETE_USER, {
    refetchQueries: [{ query: SEARCH_USERS }],
  });

export const useDeleteUsers = () =>
  useMutation<{ deleteUsers: boolean }, { ids: string[] }>(DELETE_USERS, {
    refetchQueries: [{ query: SEARCH_USERS }],
  });
