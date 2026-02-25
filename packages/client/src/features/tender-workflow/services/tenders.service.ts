import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import type {
  Tender,
  CreateTenderInput,
  UpdateTenderInput,
  SearchTenderInput,
  ChangeTenderStatusInput,
} from '@gmss/types';

// ─── Fragments ────────────────────────────────────────────────────────────────

const TENDER_FIELDS = gql`
  fragment TenderFields on Tender {
    id
    name
    referenceNumber
    issuingDepartment
    description
    status
    submissionDeadline
    rejectionReason
    mailSentAt
    createdBy
    updatedBy
    createdDate
    updatedDate
    documents {
      id
      documentName
      documentUrl
      expiresOn
      tenderId
      createdBy
      createdDate
    }
    tags {
      id
      tenderId
      tagId
      tag {
        id
        name
      }
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const SEARCH_TENDERS = gql`
  ${TENDER_FIELDS}
  query SearchTenders($searchInput: SearchTenderInput) {
    searchTenders(searchInput: $searchInput) {
      ...TenderFields
    }
  }
`;

export const GET_TENDER_BY_ID = gql`
  ${TENDER_FIELDS}
  query GetTenderById($id: ID!) {
    getTenderById(id: $id) {
      ...TenderFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_TENDER = gql`
  ${TENDER_FIELDS}
  mutation CreateTender($input: CreateTenderInput!) {
    createTender(input: $input) {
      ...TenderFields
    }
  }
`;

export const UPDATE_TENDER = gql`
  ${TENDER_FIELDS}
  mutation UpdateTender($id: ID!, $input: UpdateTenderInput!) {
    updateTender(id: $id, input: $input) {
      ...TenderFields
    }
  }
`;

export const DELETE_TENDER = gql`
  mutation DeleteTender($id: ID!) {
    deleteTender(id: $id)
  }
`;

export const DELETE_TENDERS = gql`
  mutation DeleteTenders($ids: [ID!]!) {
    deleteTenders(ids: $ids)
  }
`;

export const CHANGE_TENDER_STATUS = gql`
  ${TENDER_FIELDS}
  mutation ChangeTenderStatus($input: ChangeTenderStatusInput!) {
    changeTenderStatus(input: $input) {
      ...TenderFields
    }
  }
`;

export const CREATE_TENDER_DOCUMENT = gql`
  mutation CreateTenderDocument($input: CreateTenderDocumentInput!) {
    createTenderDocument(input: $input) {
      id
      documentName
      documentUrl
      tenderId
      createdBy
      createdDate
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useSearchTenders = (searchInput?: SearchTenderInput) =>
  useQuery<{ searchTenders: Tender[] }>(SEARCH_TENDERS, {
    variables: { searchInput },
    fetchPolicy: 'cache-and-network',
  });

export const useGetTenderById = (id: string) =>
  useQuery<{ getTenderById: Tender | null }>(GET_TENDER_BY_ID, {
    variables: { id },
    skip: !id,
  });

export const useCreateTender = () =>
  useMutation<{ createTender: Tender }, { input: CreateTenderInput }>(CREATE_TENDER, {
    refetchQueries: [{ query: SEARCH_TENDERS }],
  });

export const useUpdateTender = () =>
  useMutation<{ updateTender: Tender }, { id: string; input: UpdateTenderInput }>(UPDATE_TENDER, {
    refetchQueries: [{ query: SEARCH_TENDERS }],
  });

export const useDeleteTender = () =>
  useMutation<{ deleteTender: boolean }, { id: string }>(DELETE_TENDER, {
    refetchQueries: [{ query: SEARCH_TENDERS }],
  });

export const useDeleteTenders = () =>
  useMutation<{ deleteTenders: boolean }, { ids: string[] }>(DELETE_TENDERS, {
    refetchQueries: [{ query: SEARCH_TENDERS }],
  });

export const useChangeTenderStatus = () =>
  useMutation<{ changeTenderStatus: Tender }, { input: ChangeTenderStatusInput }>(
    CHANGE_TENDER_STATUS,
    { refetchQueries: [{ query: SEARCH_TENDERS }] },
  );

export const useCreateTenderDocument = () =>
  useMutation<
    { createTenderDocument: { id: string; documentName: string; documentUrl: string } },
    { input: { tenderId: string; documentName: string; documentUrl: string } }
  >(CREATE_TENDER_DOCUMENT, {
    refetchQueries: [{ query: SEARCH_TENDERS }],
  });
