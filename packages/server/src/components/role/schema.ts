import { gql } from "graphql-tag";

export const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    permissions: [Permission!]!
  }

  input CreateRoleInput {
    name: String!
    permissions: [Permission!]!
  }

  input UpdateRoleInput {
    name: String
    permissions: [Permission!]
  }

  extend type Query {
    getRoleById(id: ID!): Role
    searchRoles: [Role!]!
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role!
    updateRole(id: ID!, input: UpdateRoleInput!): Role!
    deleteRole(id: ID!): Boolean!
  }
`;
