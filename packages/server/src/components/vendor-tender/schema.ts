import { gql } from 'graphql-tag';

export const vendorTenderTypeDefs = gql`
  type VendorTender {
    id: ID!
    vendorId: ID!
    tenderId: ID!
    participationStatus: TenderParticipationStatus!
    quotedAmount: Float
    createdDate: String!
  }

  input ParticipateInTenderInput {
    vendorId: ID!
    tenderId: ID!
    quotedAmount: Float!
  }

  input UpdateTenderParticipationInput {
    participationId: ID!
    status: TenderParticipationStatus!
  }

  extend type Mutation {
    participateInTender(
      input: ParticipateInTenderInput!
    ): VendorTender!

    updateTenderParticipation(
      input: UpdateTenderParticipationInput!
    ): VendorTender!
  }

  extend type Query {
    getVendorTenders(vendorId: ID!): [VendorTender!]!
  }
`;
