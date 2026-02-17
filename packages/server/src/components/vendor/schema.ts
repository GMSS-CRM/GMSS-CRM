import { gql } from 'graphql-tag';

export const vendorTypeDefs = gql`
  type Vendor {
  id: ID!
  name: String!
  type: String
  status: VendorStatus!
  isRailwayLinked: Boolean!
  gstNumber: String
  panNumber: String
  cinNumber: String
  msmeUdyamNumber: String
  address: String

  tags: [VendorTag!]
  contactPersons: [VendorContactPerson!]
  documents: [VendorDocument!]

  workflows: [VendorWorkflow!]
  approvals: [VendorApproval!]
  proposals: [VendorProposal!]
  agreements: [VendorAgreement!]
  followUps: [VendorFollowUp!]
  tenders: [VendorTender!]

  createdDate: String!
  updatedDate: String!
}

input CreateVendorInput {
  name: String!
  type: String
  isRailwayLinked: Boolean
  gstNumber: String
  panNumber: String
  cinNumber: String
  msmeUdyamNumber: String
  address: String
}

input UpdateVendorInput {
  name: String
  type: String
  isRailwayLinked: Boolean
  gstNumber: String
  panNumber: String
  cinNumber: String
  msmeUdyamNumber: String
  address: String
}

input ChangeVendorStatusInput {
  vendorId: ID!
  newStatus: VendorStatus!
  remarks: String
}

extend type Query {
  getVendorById(id: ID!): Vendor
  searchVendors(search: String, status: VendorStatus): [Vendor!]!
}

extend type Mutation {
  createVendor(input: CreateVendorInput!): Vendor!
  uploadVendor(input: CreateVendorInput!): Vendor!
  updateVendor(id: ID!, input: UpdateVendorInput!): Vendor!
  deleteVendor(id: ID!): Boolean!
  deleteVendors(ids: [ID!]!): Boolean!
  changeVendorStatus(input: ChangeVendorStatusInput!): Vendor!
}
`;
