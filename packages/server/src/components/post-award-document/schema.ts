import { gql } from 'graphql-tag';

export const postAwardDocumentTypeDefs = gql`
  type PostAwardDocument {
    id: ID!
    postAwardId: ID!
    tenderId: ID!
    stage: PostAwardStage!
    documentType: String!
    documentName: String!
    documentUrl: String!
    remarks: String
    uploadedBy: String!
    createdDate: String!
  }

  input UploadPostAwardDocumentInput {
    postAwardId: ID!
    tenderId: ID!
    stage: PostAwardStage!
    documentType: String!
    documentName: String!
    documentUrl: String!
    remarks: String
  }

  extend type Query {
    getPostAwardDocuments(postAwardId: ID!): [PostAwardDocument!]!
    getPostAwardDocumentsByTender(tenderId: ID!): [PostAwardDocument!]!
    getPostAwardDocumentsByStage(postAwardId: ID!, stage: PostAwardStage!): [PostAwardDocument!]!
  }

  extend type Mutation {
    uploadPostAwardDocument(input: UploadPostAwardDocumentInput!): PostAwardDocument!
    deletePostAwardDocument(id: ID!): Boolean!
  }
`;
