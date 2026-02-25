import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import type {
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  SearchRoleInput,
} from '@gmss/types';

// ─── Fragments ────────────────────────────────────────────────────────────────

const ROLE_FIELDS = gql`
  fragment RoleFields on Role {
    id
    name
    description
    createdBy
    createdDate
    updatedBy
    updatedDate
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const SEARCH_ROLES = gql`
  ${ROLE_FIELDS}
  query SearchRoles($searchInput: SearchRoleInput) {
    searchRoles(searchInput: $searchInput) {
      ...RoleFields
    }
  }
`;

export const GET_ROLE_BY_ID = gql`
  ${ROLE_FIELDS}
  query GetRoleById($id: ID!) {
    getRoleById(id: $id) {
      ...RoleFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_ROLE = gql`
  ${ROLE_FIELDS}
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      ...RoleFields
    }
  }
`;

export const UPDATE_ROLE = gql`
  ${ROLE_FIELDS}
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      ...RoleFields
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useSearchRoles = (searchInput?: SearchRoleInput) =>
  useQuery<{ searchRoles: Role[] }>(SEARCH_ROLES, {
    variables: { searchInput },
    fetchPolicy: 'cache-and-network',
  });

export const useCreateRole = () =>
  useMutation<{ createRole: Role }, { input: CreateRoleInput }>(CREATE_ROLE, {
    refetchQueries: [{ query: SEARCH_ROLES }],
  });

export const useUpdateRole = () =>
  useMutation<{ updateRole: Role }, { input: UpdateRoleInput }>(UPDATE_ROLE, {
    refetchQueries: [{ query: SEARCH_ROLES }],
  });

export const useDeleteRole = () =>
  useMutation<{ deleteRole: boolean }, { id: string }>(DELETE_ROLE, {
    refetchQueries: [{ query: SEARCH_ROLES }],
  });
