import { gql } from 'graphql-tag';

export const vendorTypeDefs = gql`
  enum CompanyType {
    New
    Interested
    NotInterested
    Final
    Deleted
  }

  type Vendor {
    id: ID!
    name: String!
    type: String
    status: CompanyType!
    gstNumber: String
    panNumber: String
    msmeUdyamNumber: String
    cinNumber: String
    address: String
    createdBy: String!
    createdDate: String!
    updatedBy: String
    updatedDate: String!
    tags: [VendorTag!]
    contactPersons: [VendorContactPerson!]
    documents: [VendorDocument!]
  }

  input CreateVendorInput {
    name: String!
    type: String
    status: CompanyType
    gstNumber: String
    panNumber: String
    msmeUdyamNumber: String
    cinNumber: String
    address: String
    contactPersons:[CreateVendorContactPersonInput]
    tags:[CreateTagInput]
  }

  input UpdateVendorInput {
    name: String
    type: String
    status: CompanyType
    gstNumber: String
    panNumber: String
    msmeUdyamNumber: String
    cinNumber: String
    address: String
  }

  input SearchVendorInput {
    search: String
    status: CompanyType
    type: String
    limit: Int
    offset: Int
  }

  extend type Query {
    getVendorById(id: ID!): Vendor
    searchVendors(searchInput: SearchVendorInput): [Vendor!]!
  }

  extend type Mutation {
    createVendor(input: CreateVendorInput!): Vendor!
    updateVendor(id: ID!, input: UpdateVendorInput!): Vendor!
    deleteVendor(id: ID!): Boolean!
    deleteVendors(ids: [ID!]!): Boolean!
    uploadVendor(input: CreateVendorInput!): Vendor!
  }
`;
