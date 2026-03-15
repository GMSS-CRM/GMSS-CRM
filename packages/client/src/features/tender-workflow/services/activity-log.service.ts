import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TenderActivityLogItem {
  id: string;
  tenderId: string;
  action: string;
  description: string;
  metadata: string | null;
  performedBy: string;
  createdDate: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_TENDER_ACTIVITY_LOGS = gql`
  query GetTenderActivityLogs($tenderId: ID!) {
    getTenderActivityLogs(tenderId: $tenderId) {
      id
      tenderId
      action
      description
      metadata
      performedBy
      createdDate
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const LOG_TENDER_ACTIVITY = gql`
  mutation LogTenderActivity($input: LogTenderActivityInput!) {
    logTenderActivity(input: $input) {
      id
      tenderId
      action
      description
      metadata
      performedBy
      createdDate
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetTenderActivityLogs = (tenderId: string) =>
  useQuery<{ getTenderActivityLogs: TenderActivityLogItem[] }>(GET_TENDER_ACTIVITY_LOGS, {
    variables: { tenderId },
    skip: !tenderId,
    fetchPolicy: 'cache-and-network',
  });

export const useLogTenderActivity = () =>
  useMutation<
    { logTenderActivity: TenderActivityLogItem },
    { input: { tenderId: string; action: string; description: string; metadata?: string } }
  >(LOG_TENDER_ACTIVITY, {
    refetchQueries: [GET_TENDER_ACTIVITY_LOGS],
  });
