import { gql } from '@apollo/client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import type { AssignPermissionsInput, Permission, RolePermissionResult } from '@gmss/types';
import { SEARCH_ROLES } from './roles.service';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_PERMISSIONS_BY_ROLE_ID = gql`
  query GetPermissionsByRoleId($roleId: ID!) {
    getPermissionsByRoleId(roleId: $roleId)
  }
`;

export const GET_ALL_PERMISSIONS = gql`
  query GetAllPermissions {
    getAllPermissions
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const ASSIGN_PERMISSIONS = gql`
  mutation AssignPermissions($input: AssignPermissionsInput!) {
    assignPermissions(input: $input) {
      id
      roleId
      permissions
      createdBy
      createdDate
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Lazy query — call `loadPermissions({ variables: { roleId } })` to trigger.
 * Returns `data.getPermissionsByRoleId` as `Permission[]` (enum strings).
 */
export const useGetPermissionsByRoleId = () =>
  useLazyQuery<{ getPermissionsByRoleId: Permission[] }, { roleId: string }>(
    GET_PERMISSIONS_BY_ROLE_ID,
    { fetchPolicy: 'network-only' }
  );

/**
 * Regular query hook — fetches all available permissions from server.
 * Returns `data.getAllPermissions` as `Permission[]` (enum strings).
 */
export const useGetAllPermissions = () =>
  useQuery<{ getAllPermissions: Permission[] }>(GET_ALL_PERMISSIONS, {
    fetchPolicy: 'cache-first',
  });

export const useAssignPermissions = () =>
  useMutation<{ assignPermissions: RolePermissionResult }, { input: AssignPermissionsInput }>(
    ASSIGN_PERMISSIONS,
    { refetchQueries: [{ query: SEARCH_ROLES }] }
  );
