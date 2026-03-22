import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { DashboardSummary } from '@gmss/types';

export const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary {
    getDashboardSummary {
      totalTenders
      totalVendors
      totalOpenTickets
      unreadNotifications
      tendersByStatus {
        status
        count
      }
      postAwardByStage {
        stage
        count
      }
      recentTenders {
        id
        name
        referenceNumber
        status
        submissionDeadline
        createdDate
      }
    }
  }
`;

export function useDashboardSummary() {
  const { data, loading, error, refetch } = useQuery<{
    getDashboardSummary: DashboardSummary;
  }>(GET_DASHBOARD_SUMMARY, { pollInterval: 60000 });

  return {
    summary: data?.getDashboardSummary ?? null,
    loading,
    error,
    refetch,
  };
}
