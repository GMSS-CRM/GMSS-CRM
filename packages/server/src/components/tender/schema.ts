import { gql } from 'graphql-tag';

export const tenderTypeDefs = gql`
  type Tender {
    id: ID!
    name: String!
    createdBy: String!
    createdDate: String!
    updatedBy: String
    updatedDate: String!
    documents: [TenderDocument!]
    tags: [TenderTag!]
  }

  type TenderDocument {
    id: ID!
    tenderId: ID!
    documentName: String!
    documentUrl: String!
    expiresOn: String
    createdBy: String!
    createdDate: String!
  }

  type TenderTag {
    id: ID!
    tenderId: ID!
    tagId: ID!
    tag: Tag
  }

  input CreateTenderInput {
    name: String!
  }

  input UpdateTenderInput {
    name: String
  }

  input SearchTenderInput {
    search: String
    limit: Int
    offset: Int
  }

  extend type Query {
    getTenderById(id: ID!): Tender
    searchTenders(searchInput: SearchTenderInput): [Tender!]!
  }

  extend type Mutation {
    createTender(input: CreateTenderInput!): Tender!
    updateTender(id: ID!, input: UpdateTenderInput!): Tender!
    deleteTender(id: ID!): Boolean!
    deleteTenders(ids: [ID!]!): Boolean!
  }
`;
