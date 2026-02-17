import { gql } from 'graphql-tag';

export const vendorFollowUpTypeDefs = gql`
 type VendorFollowUp {
  id: ID!
  vendorId: ID!
  type: FollowUpType!
  nextFollowUpDate: String!
  remarks: String
  isCompleted: Boolean!
  reminderSent: Boolean!
  createdDate: String!
}

input CreateFollowUpInput {
  vendorId: ID!
  type: FollowUpType!
  nextFollowUpDate: String!
  remarks: String
}

input CompleteFollowUpInput {
  followUpId: ID!
}

extend type Query {
  getVendorFollowUps(vendorId: ID!): [VendorFollowUp!]!
}

extend type Mutation {
  createVendorFollowUp(input: CreateFollowUpInput!): VendorFollowUp!
  completeVendorFollowUp(input: CompleteFollowUpInput!): VendorFollowUp!
}

`;
