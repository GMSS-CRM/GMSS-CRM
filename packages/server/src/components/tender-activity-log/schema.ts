import { gql } from 'graphql-tag';

export const tenderActivityLogTypeDefs = gql`
  type TenderActivityLog {
    id: ID!
    tenderId: ID!
    action: String!
    description: String!
    metadata: String
    performedBy: String!
    createdDate: String!
  }

  input LogTenderActivityInput {
    tenderId: ID!
    action: String!
    description: String!
    metadata: String
  }

  extend type Query {
    getTenderActivityLogs(tenderId: ID!): [TenderActivityLog!]!
  }

  extend type Mutation {
    logTenderActivity(input: LogTenderActivityInput!): TenderActivityLog!
  }
`;
