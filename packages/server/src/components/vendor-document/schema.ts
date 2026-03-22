import { gql } from 'graphql-tag';

export const vendorDocumentTypeDefs = gql`

  type VendorDocument {
    id: ID!
    vendorId: ID!
    documentName: String!
    documentUrl: String!
    documentType: DocumentType!
    expiresOn: String
    createdBy: String!
    createdDate: String!
    updatedBy: String
    updatedDate: String!
  }

  input UploadVendorDocumentInput {
    vendorId: ID!
    documentName: String!
    documentUrl: String!
    documentType: DocumentType
    expiresOn: String
  }

  input UpdateVendorDocumentStandaloneInput {
    documentName: String
    documentUrl: String
    documentType: DocumentType
    expiresOn: String
  }

  input SearchVendorDocumentInput {
    vendorId: ID
    search: String
    limit: Int
    offset: Int
  }

  extend type Mutation {
    uploadVendorDocument(input: UploadVendorDocumentInput!): VendorDocument!
    updateVendorDocument(id: ID!, input: UpdateVendorDocumentStandaloneInput!): VendorDocument!
    deleteVendorDocument(id: ID!): Boolean!
    deleteVendorDocuments(ids: [ID!]!): Boolean!
  }

  extend type Query {
    getVendorDocumentById(id: ID!): VendorDocument
    searchVendorDocuments(searchInput: SearchVendorDocumentInput): [VendorDocument!]!
  }
`;