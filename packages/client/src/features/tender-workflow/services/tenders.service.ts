import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import type {
  Tender,
  VendorTender,
  CreateTenderInput,
  UpdateTenderInput,
  SearchTenderInput,
  ChangeTenderStatusInput,
  CreateTendersBatchResult,
  UpdateVendorTenderFollowUpInput,
} from '@gmss/types';
import { GET_TENDER_POST_AWARD } from './tender-post-award.service';

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
    drawingRequired
    strRequired
    specificationsRequired
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
    searchTendersAdvanced(searchInput: $searchInput) {
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

export const CREATE_TENDERS_BATCH = gql`
  mutation CreateTendersBatch($inputs: [CreateTenderInput!]!) {
    createTendersBatch(inputs: $inputs) {
      created {
        id
        name
        referenceNumber
        status
      }
      skipped {
        name
        referenceNumber
        reason
      }
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
  useQuery<{ searchTendersAdvanced: Tender[] }>(SEARCH_TENDERS, {
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

export const useCreateTendersBatch = () =>
  useMutation<
    { createTendersBatch: CreateTendersBatchResult },
    { inputs: CreateTenderInput[] }
  >(CREATE_TENDERS_BATCH);

export const useCreateTenderDocument = () =>
  useMutation<
    { createTenderDocument: { id: string; documentName: string; documentUrl: string } },
    { input: { tenderId: string; documentName: string; documentUrl: string } }
  >(CREATE_TENDER_DOCUMENT, {
    refetchQueries: [{ query: SEARCH_TENDERS }],
  });

// ─── Deadline Reminders ───────────────────────────────────────────────────────

const CHECK_DEADLINE_REMINDERS = gql`
  mutation CheckTenderDeadlineReminders {
    checkTenderDeadlineReminders
  }
`;

export const useCheckDeadlineReminders = () =>
  useMutation<{ checkTenderDeadlineReminders: number }>(CHECK_DEADLINE_REMINDERS);

// ─── Vendor Follow-Up ─────────────────────────────────────────────────────────

const VENDOR_TENDER_FOLLOW_UP_FIELDS = gql`
  fragment VendorTenderFollowUpFields on VendorTender {
    id
    vendorId
    tenderId
    sharedDate
    isParticipating
    participationStatus
    interestStatus
    notInterestedReason
    proposalShared
    tieUpAgreementObtained
    quoteReceived
    quoteUrl
    quotedAmount
    quoteApproved
    companyDocsUploaded
    tenderDocsUploaded
    emdRequired
    emdSource
    emdAmount
    emdPaid
    tabulationType
    tabulationUploaded
    tabulationApproved
    participationDecisionReason
    followUpRemarks
    createdDate
    updatedDate
    vendor {
      id
      name
      status
      type
      contactPersons {
        id
        name
        email
        phoneNumber
        designation
      }
    }
  }
`;

export const GET_TENDER_FOLLOW_UPS = gql`
  ${VENDOR_TENDER_FOLLOW_UP_FIELDS}
  query GetTenderFollowUps($tenderId: ID!) {
    getTenderFollowUps(tenderId: $tenderId) {
      ...VendorTenderFollowUpFields
    }
  }
`;

export const UPDATE_VENDOR_TENDER_FOLLOW_UP = gql`
  ${VENDOR_TENDER_FOLLOW_UP_FIELDS}
  mutation UpdateVendorTenderFollowUp($input: UpdateVendorTenderFollowUpInput!) {
    updateVendorTenderFollowUp(input: $input) {
      ...VendorTenderFollowUpFields
    }
  }
`;

export const useGetTenderFollowUps = (tenderId: string) =>
  useQuery<{ getTenderFollowUps: VendorTender[] }>(GET_TENDER_FOLLOW_UPS, {
    variables: { tenderId },
    skip: !tenderId,
    fetchPolicy: 'cache-and-network',
  });

export const useUpdateVendorTenderFollowUp = () =>
  useMutation<
    { updateVendorTenderFollowUp: VendorTender },
    { input: UpdateVendorTenderFollowUpInput }
  >(UPDATE_VENDOR_TENDER_FOLLOW_UP, {
    refetchQueries: [GET_TENDER_FOLLOW_UPS],
  });

// ─── Seed Tender Vendors ──────────────────────────────────────────────────────

const SEED_TENDER_VENDORS = gql`
  mutation SeedTenderVendors($tenderId: ID!) {
    seedTenderVendors(tenderId: $tenderId)
  }
`;

export const useSeedTenderVendors = () =>
  useMutation<{ seedTenderVendors: boolean }, { tenderId: string }>(
    SEED_TENDER_VENDORS,
    { refetchQueries: [GET_TENDER_FOLLOW_UPS] },
  );

// ─── Mark Vendor as Winner ────────────────────────────────────────────────────

const MARK_VENDOR_AS_WINNER = gql`
  mutation MarkVendorAsWinner($tenderId: ID!, $vendorId: ID!) {
    markVendorAsWinner(tenderId: $tenderId, vendorId: $vendorId) {
      id
      tenderId
      currentStage
      winningVendorId
    }
  }
`;

export const useMarkVendorAsWinner = () =>
  useMutation<
    { markVendorAsWinner: { id: string; tenderId: string; currentStage: string; winningVendorId: string } },
    { tenderId: string; vendorId: string }
  >(MARK_VENDOR_AS_WINNER, {
    refetchQueries: [GET_TENDER_FOLLOW_UPS, GET_TENDER_POST_AWARD],
  });
