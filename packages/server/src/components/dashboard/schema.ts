import { gql } from 'graphql-tag';

export const dashboardTypeDefs = gql`
  type TenderStatusCount {
    status: String!
    count: Int!
  }

  type PostAwardStageCount {
    stage: String!
    count: Int!
  }

  type DashboardSummary {
    totalTenders: Int!
    totalVendors: Int!
    totalOpenTickets: Int!
    unreadNotifications: Int!
    tendersByStatus: [TenderStatusCount!]!
    postAwardByStage: [PostAwardStageCount!]!
    recentTenders: [Tender!]!
  }

  extend type Query {
    getDashboardSummary: DashboardSummary!
  }
`;
