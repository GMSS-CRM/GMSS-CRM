import { gql } from 'graphql-tag';

export const notificationTypeDefs = gql`
  enum NotificationType {
    PAYMENT_DUE
    SD_RELEASE
    DOCUMENT_EXPIRY
    AGREEMENT_RENEWAL
    FOLLOW_UP_DUE
    TENDER_DEADLINE
    TASK_ASSIGNED
    GENERAL
  }

  type Notification {
    id: ID!
    userId: String
    type: NotificationType!
    title: String!
    body: String
    referenceId: String
    referenceType: String
    isRead: Boolean!
    isDismissed: Boolean!
    createdDate: String!
  }

  extend type Query {
    getNotifications(userId: String): [Notification!]!
    getUnreadNotificationCount(userId: String): Int!
  }

  extend type Mutation {
    createNotification(
      userId: String
      type: NotificationType!
      title: String!
      body: String
      referenceId: String
      referenceType: String
    ): Notification!
    markNotificationRead(id: ID!): Notification!
    markAllNotificationsRead(userId: String): Boolean!
    dismissNotification(id: ID!): Boolean!
  }
`;
