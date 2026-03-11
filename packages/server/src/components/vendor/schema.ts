import { gql } from 'graphql-tag';

export const vendorTypeDefs = gql`

  type Vendor {
    id: ID!
    name: String!
    type: String
    status: VendorStatus!
    isRailwayLinked: Boolean!
    agreementWith: String
    gstNumber: String
    panNumber: String
    cinNumber: String
    msmeUdyamNumber: String
    address: String

    tags: [VendorTag!]
    contactPersons: [VendorContactPerson!]
    documents: [VendorDocument!]
    paymentTerms: [PaymentTerm!]

    workflows: [VendorWorkflow!]
    approvals: [VendorApproval!]
    proposals: [VendorProposal!]
    agreements: [VendorAgreement!]
    followUps: [VendorFollowUp!]
    tenders: [VendorTender!]

    createdDate: String!
    updatedDate: String!
    createdBy: String
    updatedBy: String
  }

  # ---------- Nested Contact Person ----------

  input CreateVendorContactPersonInput {
    name: String!
    designation: String
    phoneNumber: String!
    email: String!
    cc: String
    bcc: String
  }

  input UpdateVendorContactPersonInput {
    id: ID
    name: String
    designation: String
    phoneNumber: String
    email: String
    cc: String
    bcc: String
  }

  # ---------- Nested Documents ----------

  input CreateVendorDocumentInput {
    documentName: String!
    documentUrl: String!
    expiresOn: String
  }

  input UpdateVendorDocumentInput {
    id: ID
    documentName: String
    documentUrl: String
    expiresOn: String
  }

  # ---------- Vendor ----------

  input CreateVendorInput {
    name: String!
    type: String
    isRailwayLinked: Boolean
    agreementWith: String
    gstNumber: String
    panNumber: String
    cinNumber: String
    msmeUdyamNumber: String
    address: String

    contactPersons: [CreateVendorContactPersonInput!]
    documents: [CreateVendorDocumentInput!]
    tagIds: [ID!]
  }

  input UpdateVendorInput {
    name: String
    type: String
    isRailwayLinked: Boolean
    agreementWith: String
    gstNumber: String
    panNumber: String
    cinNumber: String
    msmeUdyamNumber: String
    address: String

    contactPersons: [UpdateVendorContactPersonInput!]
    documents: [UpdateVendorDocumentInput!]
    tagIds: [ID!]
  }

  extend type Query {
    getVendorById(id: ID!): Vendor
    searchVendors(search: String, status: VendorStatus): [Vendor!]!
    getPaymentTermsByVendor(vendorId: ID!): [PaymentTerm!]!
  }

  extend type Mutation {
    createVendor(input: CreateVendorInput!): Vendor!
    updateVendor(id: ID!, input: UpdateVendorInput!): Vendor!
    deleteVendor(id: ID!): Boolean!
    deleteVendors(ids: [ID!]!): Boolean!
  }
`;