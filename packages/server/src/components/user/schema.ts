import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    roleId: ID!      
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String
    email: String!
    roleId: ID!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    roleId: ID
  }

  extend type Query {
    getUserById(id: ID!): User
    searchUsers(search: String, limit: Int, offset: Int): [User!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    deleteUsers(ids: [ID!]!): Boolean!
  }
`;
