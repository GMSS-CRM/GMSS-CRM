import { gql } from 'graphql-tag';

export const vendorFollowUpTypeDefs = gql`
 type VendorFollowUp {
  id: ID!
  vendorId: ID!
  type: FollowUpType!
  followUpStatus: FollowUpStatus!
  nextFollowUpDate: String
  remarks: String
  documentUrl: String
  documentName: String
  courierTrackingNumber: String
  courierProvider: String
  courierDeliveryRemarks: String
  autoMailSent: Boolean!
  isCompleted: Boolean!
  createdDate: String!
  updatedDate: String!
  createdBy: String!
}

input CreateFollowUpInput {
  vendorId: ID!
  type: FollowUpType!
  remarks: String
  nextFollowUpDate: String
  courierTrackingNumber: String
  courierProvider: String
  courierDeliveryRemarks: String
}

input UpdateFollowUpInput {
  followUpId: ID!
  followUpStatus: FollowUpStatus
  remarks: String
  nextFollowUpDate: String
  documentUrl: String
  documentName: String
  courierTrackingNumber: String
  courierProvider: String
  courierDeliveryRemarks: String
  isCompleted: Boolean
}

extend type Query {
  getVendorFollowUps(vendorId: ID!): [VendorFollowUp!]!
}

extend type Mutation {
  createVendorFollowUp(input: CreateFollowUpInput!): VendorFollowUp!
  updateVendorFollowUp(input: UpdateFollowUpInput!): VendorFollowUp!
  deleteVendorFollowUp(id: ID!): Boolean!
}

`;
