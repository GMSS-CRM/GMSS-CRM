import { gql } from 'graphql-tag';

export const uploadTypeDefs = gql`
  input GenerateUploadUrlInput {
    folder: String!
    fileName: String!
    contentType: String!
  }

  type UploadUrlResult {
    uploadUrl: String!
    key: String!
    publicUrl: String!
  }

  extend type Mutation {
    generatePresignedUploadUrl(input: GenerateUploadUrlInput!): UploadUrlResult!
  }
`;
