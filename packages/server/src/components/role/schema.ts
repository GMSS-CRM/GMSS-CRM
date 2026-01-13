import { gql } from 'graphql-tag';

export const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    description: String
    createdBy: String!
    updatedBy: String!
    createdDate: String!
    updatedDate: String!
  }

  input CreateRoleInput {
    name: String!
    description: String
  }

  input UpdateRoleInput {
    id: ID!
    name: String
    description: String
  }

  input SearchRoleInput {
    search: String
    limit: Int
    offset: Int
  }

  extend type Query {
    getRoleById(id: ID!): Role
    searchRoles(searchInput: SearchRoleInput): [Role!]!
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role!
    updateRole(input: UpdateRoleInput!): Role!
    deleteRole(id: ID!): Boolean!
  }
`;
