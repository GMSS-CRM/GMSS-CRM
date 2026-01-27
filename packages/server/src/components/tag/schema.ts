import { gql } from 'graphql-tag';

export const tagTypeDefs = gql`
  type Tag {
    id: ID!
    name: String!
    createdBy: String!
    updatedBy: String
    createdDate: String!
    updatedDate: String!
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  input SearchTagInput {
    search: String
    limit: Int
    offset: Int
  }

  extend type Query {
    getTagById(id: ID!): Tag
    searchTags(searchInput: SearchTagInput): [Tag!]!
  }

  extend type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteTag(id: ID!): Boolean!
    deleteTags(ids: [ID!]!): Boolean!
  }
`;
