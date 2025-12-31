import { gql } from "graphql-tag";

export const appSettingTypeDefs = gql`
  type AppSetting {
    id: ID!
    name: String!
    tagline: String
    email: String!
    phoneNumber: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateAppSettingInput {
    name: String!
    tagline: String
    email: String!
    phoneNumber: String!
  }

  input UpdateAppSettingInput {
    name: String
    tagline: String
    email: String
    phoneNumber: String
  }

  extend type Query {
    getAppSettingById(id: ID!): AppSetting
    getAppSettingsAll(search: String): [AppSetting!]!
  }

  extend type Mutation {
    createAppSetting(input: CreateAppSettingInput!): AppSetting!
    updateAppSetting(id: ID!, input: UpdateAppSettingInput!): AppSetting!
    deleteAppSetting(id: ID!): Boolean!
  }
`;
