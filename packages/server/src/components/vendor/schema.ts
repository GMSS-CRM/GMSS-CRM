import { gql } from 'graphql-tag';

export const vendorTypeDefs = gql`
  enum VendorType {
    Vendor
    Consultant
  }

  enum VendorStatus {
    Approved
    Draft
    Submitted
    Rejected
  }

  type Vendor {
    id: ID!
    name: String!
    type: VendorType!
    status: VendorStatus!
    gstNumber: String
    panNumber: String
    msmeUdyamNumber: String
    cinNumber: String
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
    type: VendorType
    status: VendorStatus
    gstNumber: String
    panNumber: String
    msmeUdyamNumber: String
    cinNumber: String
  }

  input UpdateVendorInput {
    name: String
    type: VendorType
    status: VendorStatus
    gstNumber: String
    panNumber: String
    msmeUdyamNumber: String
    cinNumber: String
  }

  input SearchVendorInput {
    search: String
    status: VendorStatus
    type: VendorType
    limit: Int
    offset: Int
  }

  type VendorTag {
    id: ID!
    vendorId: ID!
    tagId: ID!
    tag: Tag
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
