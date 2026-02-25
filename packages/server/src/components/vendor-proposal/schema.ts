import { gql } from 'graphql-tag';

export const vendorProposalTypeDefs = gql`
  type VendorProposal {
    id: ID!
    vendorId: ID!
    status: ProposalStatus!
    sentDate: String
    followUpDate: String
    remarks: String
    createdDate: String!
  }

  input CreateProposalInput {
    vendorId: ID!
    remarks: String
  }

  input UpdateProposalStatusInput {
    proposalId: ID!
    status: ProposalStatus!
    followUpDate: String
    remarks: String
  }

  extend type Query {
    getVendorProposals(vendorId: ID!): [VendorProposal!]!
  }

  extend type Mutation {
    createVendorProposal(input: CreateProposalInput!): VendorProposal!
    updateVendorProposalStatus(
      input: UpdateProposalStatusInput!
    ): VendorProposal!
  }
`;
