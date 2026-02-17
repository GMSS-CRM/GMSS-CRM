import { gql } from 'graphql-tag';

export const vendorWorkflowTypeDefs = gql`
  type VendorWorkflow {
    id: ID!
    vendorId: ID!
    fromStatus: VendorStatus!
    toStatus: VendorStatus!
    remarks: String
    changedBy: String!
    changedAt: String!
  }

  input ChangeVendorStatusInput {
    vendorId: ID!
    newStatus: VendorStatus!
    remarks: String
  }

  extend type Query {
    getVendorWorkflow(vendorId: ID!): [VendorWorkflow!]!
  }

  extend type Mutation {
    changeVendorStatus(input: ChangeVendorStatusInput!): Vendor!
  }
`;
