import { gql } from 'graphql-tag';

export const vendorMdRequestTypeDefs = gql`
  type VendorMdRequest {
    id: ID!
    vendorId: ID!
    empId: String!
    empRemark: String
    mdId: String
    mdRemark: String
    isResolved: Boolean!
    createdDate: String!
    updatedDate: String!
    vendor: Vendor
  }

  input CreateMdRequestInput {
    vendorId: ID!
    empId: String
    empRemark: String
  }

  input ResolveMdRequestInput {
    requestId: ID!
    mdId: String
    mdRemark: String
    approved: Boolean!
  }

  extend type Query {
    getPendingMdRequests: [VendorMdRequest!]!
    getResolvedMdRequests: [VendorMdRequest!]!
    getMdRequestsByVendor(vendorId: ID!): [VendorMdRequest!]!
    getActivePendingRequest(vendorId: ID!): VendorMdRequest
  }

  extend type Mutation {
    createMdRequest(input: CreateMdRequestInput!): VendorMdRequest!
    resolveMdRequest(input: ResolveMdRequestInput!): VendorMdRequest!
  }
`;
