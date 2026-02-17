import { gql } from 'graphql-tag';

export const vendorApprovalTypeDefs = gql`
  type VendorApproval {
    id: ID!
    vendorId: ID!
    status: ApprovalStatus!
    remarks: String
    approvedBy: String
    approvedDate: String
    createdDate: String!
  }

  input CreateApprovalInput {
    vendorId: ID!
  }

  input DecideApprovalInput {
    approvalId: ID!
    status: ApprovalStatus!
    remarks: String
  }

  extend type Query {
    getVendorApprovals(vendorId: ID!): [VendorApproval!]!
  }

  extend type Mutation {
    requestVendorApproval(input: CreateApprovalInput!): VendorApproval!
    decideVendorApproval(input: DecideApprovalInput!): Vendor!
  }
`;
