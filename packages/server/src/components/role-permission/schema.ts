import { gql } from 'graphql-tag';

export const rolePermissionTypeDefs = gql`
  type RolePermissionResult {
    roleId: ID!
    permissions: [Permission!]!
  }

  input AssignPermissionsInput {
    roleId: ID!
    permissions: [Permission!]!
  }

  extend type Query {
    permissionsByRoleId(roleId: ID!): [Permission!]!
  }

  extend type Mutation {
    assignPermissions(input: AssignPermissionsInput!): RolePermissionResult!
  }
`;
