import { gql } from 'graphql-tag';

export const vendorDocumentTypeDefs = gql`
  type VendorDocument {
    id: ID!
    vendorId: ID!
    documentName: String!
    documentUrl: String!
    expiresOn: String
    createdBy: String!
    createdDate: String!
    updatedBy: String
    updatedDate: String!
  }

  input CreateVendorDocumentInput {
    vendorId: ID!
    documentName: String!
    documentUrl: String!
    expiresOn: String
  }

  input UpdateVendorDocumentInput {
    documentName: String
    documentUrl: String
    expiresOn: String
  }

  input SearchVendorDocumentInput {
    vendorId: ID
    search: String
    limit: Int
    offset: Int
  }

  extend type Mutation {
    createVendorDocument(input: CreateVendorDocumentInput!): VendorDocument!
    updateVendorDocument(id: ID!, input: UpdateVendorDocumentInput!): VendorDocument!
    deleteVendorDocument(id: ID!): Boolean!
    deleteVendorDocuments(ids: [ID!]!): Boolean!
  }

  extend type Query {
    getVendorDocumentById(id: ID!): VendorDocument
    searchVendorDocuments(searchInput: SearchVendorDocumentInput): [VendorDocument!]!
  }
`;
