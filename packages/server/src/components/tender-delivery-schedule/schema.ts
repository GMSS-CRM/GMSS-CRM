import { gql } from 'graphql-tag';

export const tenderDeliveryScheduleTypeDefs = gql`
  enum DeliveryType {
    ONE_TIME
    PARTIAL
    OPTION_CLAUSE
  }

  enum DeliveryScheduleStatus {
    PENDING
    CONFIRMED
    EXTENDED
  }

  type TenderDeliverySchedule {
    id: ID!
    postAwardId: ID!
    deliveryType: DeliveryType!
    scheduledDate: String!
    quantity: Float
    confirmedDate: String
    proofUrl: String
    status: DeliveryScheduleStatus!
    createdBy: String!
    createdDate: String!
    updatedDate: String!
  }

  input CreateDeliveryScheduleInput {
    postAwardId: ID!
    deliveryType: DeliveryType!
    scheduledDate: String!
    quantity: Float
  }

  input UpdateDeliveryScheduleInput {
    deliveryType: DeliveryType
    scheduledDate: String
    quantity: Float
    confirmedDate: String
    proofUrl: String
    status: DeliveryScheduleStatus
  }

  extend type Query {
    getDeliverySchedules(postAwardId: ID!): [TenderDeliverySchedule!]!
  }

  extend type Mutation {
    createDeliverySchedule(input: CreateDeliveryScheduleInput!): TenderDeliverySchedule!
    updateDeliverySchedule(id: ID!, input: UpdateDeliveryScheduleInput!): TenderDeliverySchedule!
    deleteDeliverySchedule(id: ID!): Boolean!
  }
`;
