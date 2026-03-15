import { gql } from 'graphql-tag';

export const postAwardFollowUpTypeDefs = gql`
  enum FollowUpPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  type PostAwardFollowUp {
    id: ID!
    postAwardId: ID!
    tenderId: ID!
    stage: PostAwardStage!
    priority: FollowUpPriority!
    remarks: String
    contactPerson: String
    contactPhone: String
    contactEmail: String
    followUpDate: String
    nextFollowUpDate: String
    isCompleted: Boolean!
    outcome: String
    createdBy: String!
    createdDate: String!
    updatedDate: String!
  }

  input CreatePostAwardFollowUpInput {
    postAwardId: ID!
    tenderId: ID!
    stage: PostAwardStage!
    priority: FollowUpPriority
    remarks: String
    contactPerson: String
    contactPhone: String
    contactEmail: String
    followUpDate: String
    nextFollowUpDate: String
  }

  input UpdatePostAwardFollowUpInput {
    id: ID!
    priority: FollowUpPriority
    remarks: String
    contactPerson: String
    contactPhone: String
    contactEmail: String
    followUpDate: String
    nextFollowUpDate: String
  }

  extend type Query {
    getPostAwardFollowUps(postAwardId: ID!): [PostAwardFollowUp!]!
    getPostAwardFollowUpsByTender(tenderId: ID!): [PostAwardFollowUp!]!
    getPostAwardFollowUpsByStage(postAwardId: ID!, stage: PostAwardStage!): [PostAwardFollowUp!]!
    getPendingPostAwardFollowUps: [PostAwardFollowUp!]!
    getOverduePostAwardFollowUps: [PostAwardFollowUp!]!
  }

  extend type Mutation {
    createPostAwardFollowUp(input: CreatePostAwardFollowUpInput!): PostAwardFollowUp!
    updatePostAwardFollowUp(input: UpdatePostAwardFollowUpInput!): PostAwardFollowUp!
    completePostAwardFollowUp(id: ID!, outcome: String!): PostAwardFollowUp!
  }
`;
