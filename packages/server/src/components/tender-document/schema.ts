import { gql } from 'graphql-tag';

export const tenderDocumentTypeDefs = gql`
  type TenderDocument {
    id: ID!
    tenderId: ID!
    documentName: String!
    documentUrl: String!
    expiresOn: String
    createdBy: String!
    createdDate: String!
  }

  input CreateTenderDocumentInput {
    tenderId: ID!
    documentName: String!
    documentUrl: String!
    expiresOn: String
  }

  input UpdateTenderDocumentInput {
    documentName: String
    documentUrl: String
    expiresOn: String
  }

  input SearchTenderDocumentInput {
    tenderId: ID
    search: String
    limit: Int
    offset: Int
  }

  extend type Mutation {
    createTenderDocument(input: CreateTenderDocumentInput!): TenderDocument!
    updateTenderDocument(id: ID!, input: UpdateTenderDocumentInput!): TenderDocument!
    deleteTenderDocument(id: ID!): Boolean!
    deleteTenderDocuments(ids: [ID!]!): Boolean!
  }

  extend type Query {
    getTenderDocumentById(id: ID!): TenderDocument
    searchTenderDocuments(searchInput: SearchTenderDocumentInput): [TenderDocument!]!
  }
`;
