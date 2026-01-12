import { gql } from 'graphql-tag';

export const rolePermissionTypeDefs = gql`
  type RolePermissionResult {
    roleId: ID!
    permissions: [Permission!]!
    createdBy: String!
    createdDate: String!
  }

  input AssignPermissionsInput {
    roleId: ID!
    permissions: [Permission!]!
  }

  extend type Query {
    getPermissionsByRoleId(roleId: ID!): [Permission!]!
  }

  extend type Mutation {
    assignPermissions(input: AssignPermissionsInput!): RolePermissionResult!
  }
`;
