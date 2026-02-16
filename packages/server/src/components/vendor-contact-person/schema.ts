import { gql } from 'graphql-tag';

export const vendorContactPersonTypeDefs = gql`
  type VendorContactPerson {
    id: ID!
    vendorId: ID!
    name: String!
    designation: String
    phoneNumber: String!
    email: String!
    cc: String
    bcc: String
    createdBy: String!
    createdDate: String!
    updatedBy: String
    updatedDate: String!
  }

  input CreateVendorContactPersonInput {
    name: String!
    designation: String
    phoneNumber: String!
    email: String!
    cc: String
    bcc: String
  }

  input UpdateVendorContactPersonInput {
    vendorId: ID!
    name: String
    designation: String
    phoneNumber: String
    email: String
    cc: String
    bcc: String
  }

  input SearchVendorContactPersonInput {
    vendorId: ID
    search: String
    limit: Int
    offset: Int
  }

  extend type Mutation {
    createVendorContactPerson(input: CreateVendorContactPersonInput!): VendorContactPerson!
    updateVendorContactPerson(id: ID!, input: UpdateVendorContactPersonInput!): VendorContactPerson!
    deleteVendorContactPerson(id: ID!): Boolean!
    deleteVendorContactPersons(ids: [ID!]!): Boolean!
  }

  extend type Query {
    getVendorContactPersonById(id: ID!): VendorContactPerson
    searchVendorContactPersons(searchInput: SearchVendorContactPersonInput): [VendorContactPerson!]!
  }
`;
