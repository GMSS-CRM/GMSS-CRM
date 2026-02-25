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

  input CreateVendorContactPersonStandaloneInput {
    vendorId: ID!
    name: String!
    designation: String
    phoneNumber: String!
    email: String!
    cc: String
    bcc: String
  }

  input UpdateVendorContactPersonStandaloneInput {
    name: String
    designation: String
    phoneNumber: String
    email: String
    cc: String
    bcc: String
  }

  extend type Mutation {
    createVendorContactPerson(input: CreateVendorContactPersonStandaloneInput!): VendorContactPerson!
    updateVendorContactPerson(id: ID!, input: UpdateVendorContactPersonStandaloneInput!): VendorContactPerson!
    deleteVendorContactPerson(id: ID!): Boolean!
    deleteVendorContactPersons(ids: [ID!]!): Boolean!
  }

  extend type Query {
    getVendorContactPersonById(id: ID!): VendorContactPerson
    searchVendorContactPersons(search: String, vendorId: ID): [VendorContactPerson!]!
  }
`;