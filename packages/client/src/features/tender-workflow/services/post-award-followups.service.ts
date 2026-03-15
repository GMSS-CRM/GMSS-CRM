import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostAwardFollowUpItem {
  id: string;
  postAwardId: string;
  tenderId: string;
  stage: string;
  priority: string;
  remarks: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  followUpDate: string | null;
  nextFollowUpDate: string | null;
  isCompleted: boolean;
  outcome: string | null;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

// ─── Fragment ─────────────────────────────────────────────────────────────────

const POST_AWARD_FOLLOWUP_FIELDS = gql`
  fragment PostAwardFollowUpFields on PostAwardFollowUp {
    id
    postAwardId
    tenderId
    stage
    priority
    remarks
    contactPerson
    contactPhone
    contactEmail
    followUpDate
    nextFollowUpDate
    isCompleted
    outcome
    createdBy
    createdDate
    updatedDate
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_POST_AWARD_FOLLOW_UPS = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  query GetPostAwardFollowUps($postAwardId: ID!) {
    getPostAwardFollowUps(postAwardId: $postAwardId) {
      ...PostAwardFollowUpFields
    }
  }
`;

export const GET_POST_AWARD_FOLLOW_UPS_BY_TENDER = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  query GetPostAwardFollowUpsByTender($tenderId: ID!) {
    getPostAwardFollowUpsByTender(tenderId: $tenderId) {
      ...PostAwardFollowUpFields
    }
  }
`;

export const GET_PENDING_FOLLOW_UPS = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  query GetPendingPostAwardFollowUps {
    getPendingPostAwardFollowUps {
      ...PostAwardFollowUpFields
    }
  }
`;

export const GET_OVERDUE_FOLLOW_UPS = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  query GetOverduePostAwardFollowUps {
    getOverduePostAwardFollowUps {
      ...PostAwardFollowUpFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_POST_AWARD_FOLLOW_UP = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  mutation CreatePostAwardFollowUp($input: CreatePostAwardFollowUpInput!) {
    createPostAwardFollowUp(input: $input) {
      ...PostAwardFollowUpFields
    }
  }
`;

export const UPDATE_POST_AWARD_FOLLOW_UP = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  mutation UpdatePostAwardFollowUp($input: UpdatePostAwardFollowUpInput!) {
    updatePostAwardFollowUp(input: $input) {
      ...PostAwardFollowUpFields
    }
  }
`;

export const COMPLETE_POST_AWARD_FOLLOW_UP = gql`
  ${POST_AWARD_FOLLOWUP_FIELDS}
  mutation CompletePostAwardFollowUp($id: ID!, $outcome: String!) {
    completePostAwardFollowUp(id: $id, outcome: $outcome) {
      ...PostAwardFollowUpFields
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetPostAwardFollowUps = (postAwardId: string) =>
  useQuery<{ getPostAwardFollowUps: PostAwardFollowUpItem[] }>(GET_POST_AWARD_FOLLOW_UPS, {
    variables: { postAwardId },
    skip: !postAwardId,
    fetchPolicy: 'cache-and-network',
  });

export const useGetPostAwardFollowUpsByTender = (tenderId: string) =>
  useQuery<{ getPostAwardFollowUpsByTender: PostAwardFollowUpItem[] }>(
    GET_POST_AWARD_FOLLOW_UPS_BY_TENDER,
    {
      variables: { tenderId },
      skip: !tenderId,
      fetchPolicy: 'cache-and-network',
    },
  );

export const useGetPendingFollowUps = () =>
  useQuery<{ getPendingPostAwardFollowUps: PostAwardFollowUpItem[] }>(GET_PENDING_FOLLOW_UPS, {
    fetchPolicy: 'cache-and-network',
  });

export const useGetOverdueFollowUps = () =>
  useQuery<{ getOverduePostAwardFollowUps: PostAwardFollowUpItem[] }>(GET_OVERDUE_FOLLOW_UPS, {
    fetchPolicy: 'cache-and-network',
  });

export const useCreatePostAwardFollowUp = () =>
  useMutation<
    { createPostAwardFollowUp: PostAwardFollowUpItem },
    {
      input: {
        postAwardId: string;
        tenderId: string;
        stage: string;
        priority?: string;
        remarks?: string;
        contactPerson?: string;
        contactPhone?: string;
        contactEmail?: string;
        followUpDate?: string;
        nextFollowUpDate?: string;
      };
    }
  >(CREATE_POST_AWARD_FOLLOW_UP, {
    refetchQueries: [GET_POST_AWARD_FOLLOW_UPS],
  });

export const useUpdatePostAwardFollowUp = () =>
  useMutation<
    { updatePostAwardFollowUp: PostAwardFollowUpItem },
    {
      input: {
        id: string;
        priority?: string;
        remarks?: string;
        contactPerson?: string;
        contactPhone?: string;
        contactEmail?: string;
        followUpDate?: string;
        nextFollowUpDate?: string;
      };
    }
  >(UPDATE_POST_AWARD_FOLLOW_UP, {
    refetchQueries: [GET_POST_AWARD_FOLLOW_UPS],
  });

export const useCompletePostAwardFollowUp = () =>
  useMutation<
    { completePostAwardFollowUp: PostAwardFollowUpItem },
    { id: string; outcome: string }
  >(COMPLETE_POST_AWARD_FOLLOW_UP, {
    refetchQueries: [GET_POST_AWARD_FOLLOW_UPS],
  });

/** Priority options for follow-up creation */
export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'default' },
  { value: 'MEDIUM', label: 'Medium', color: 'processing' },
  { value: 'HIGH', label: 'High', color: 'warning' },
  { value: 'URGENT', label: 'Urgent', color: 'error' },
] as const;
