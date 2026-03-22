import { gql } from 'graphql-tag';

export const courierRecordTypeDefs = gql`
  enum CourierDirection {
    INBOUND
    OUTBOUND
  }

  enum CourierStatus {
    DISPATCHED
    IN_TRANSIT
    DELIVERED
  }

  type CourierRecord {
    id: ID!
    direction: CourierDirection!
    courierCompany: String
    courierContact: String
    courierEmail: String
    awbNumber: String
    trackingUrl: String
    senderName: String
    receiverName: String
    dispatchDate: String
    receivedDate: String
    status: CourierStatus!
    receiptProofUrl: String
    referenceId: String
    referenceType: String
    createdBy: String!
    createdDate: String!
    updatedDate: String!
  }

  input CreateCourierRecordInput {
    direction: CourierDirection!
    courierCompany: String
    courierContact: String
    courierEmail: String
    awbNumber: String
    trackingUrl: String
    senderName: String
    receiverName: String
    dispatchDate: String
    status: CourierStatus
    receiptProofUrl: String
    referenceId: String
    referenceType: String
  }

  input UpdateCourierRecordInput {
    courierCompany: String
    courierContact: String
    courierEmail: String
    awbNumber: String
    trackingUrl: String
    senderName: String
    receiverName: String
    dispatchDate: String
    receivedDate: String
    status: CourierStatus
    receiptProofUrl: String
  }

  extend type Query {
    getCourierRecords: [CourierRecord!]!
    getCourierRecordById(id: ID!): CourierRecord
    getCourierRecordsByReference(referenceId: String!, referenceType: String!): [CourierRecord!]!
  }

  extend type Mutation {
    createCourierRecord(input: CreateCourierRecordInput!): CourierRecord!
    updateCourierRecord(id: ID!, input: UpdateCourierRecordInput!): CourierRecord!
    deleteCourierRecord(id: ID!): Boolean!
  }
`;
