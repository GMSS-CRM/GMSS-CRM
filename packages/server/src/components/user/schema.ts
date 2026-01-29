import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    roleId: ID
    role: Role!
    createdBy: String!
    createdDate: String!
    updatedBy: String!
    updatedDate: String!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String
    email: String!
    roleId: ID
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    roleId: ID
  }

  input SearchUserInput {
    search: String
    limit: Int
    offset: Int
  }

  extend type Query {
    getUserById(id: ID!): User
    searchUsers(searchInput: SearchUserInput): [User!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    deleteUsers(ids: [ID!]!): Boolean!
  }
`;
