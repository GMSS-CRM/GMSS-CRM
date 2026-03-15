import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostAwardDocumentItem {
  id: string;
  postAwardId: string;
  tenderId: string;
  stage: string;
  documentType: string;
  documentName: string;
  documentUrl: string;
  remarks: string | null;
  uploadedBy: string;
  createdDate: string;
}

// ─── Fragment ─────────────────────────────────────────────────────────────────

const POST_AWARD_DOC_FIELDS = gql`
  fragment PostAwardDocFields on PostAwardDocument {
    id
    postAwardId
    tenderId
    stage
    documentType
    documentName
    documentUrl
    remarks
    uploadedBy
    createdDate
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_POST_AWARD_DOCUMENTS = gql`
  ${POST_AWARD_DOC_FIELDS}
  query GetPostAwardDocuments($postAwardId: ID!) {
    getPostAwardDocuments(postAwardId: $postAwardId) {
      ...PostAwardDocFields
    }
  }
`;

export const GET_POST_AWARD_DOCUMENTS_BY_STAGE = gql`
  ${POST_AWARD_DOC_FIELDS}
  query GetPostAwardDocumentsByStage($postAwardId: ID!, $stage: PostAwardStage!) {
    getPostAwardDocumentsByStage(postAwardId: $postAwardId, stage: $stage) {
      ...PostAwardDocFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const UPLOAD_POST_AWARD_DOCUMENT = gql`
  ${POST_AWARD_DOC_FIELDS}
  mutation UploadPostAwardDocument($input: UploadPostAwardDocumentInput!) {
    uploadPostAwardDocument(input: $input) {
      ...PostAwardDocFields
    }
  }
`;

export const DELETE_POST_AWARD_DOCUMENT = gql`
  mutation DeletePostAwardDocument($id: ID!) {
    deletePostAwardDocument(id: $id)
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetPostAwardDocuments = (postAwardId: string) =>
  useQuery<{ getPostAwardDocuments: PostAwardDocumentItem[] }>(GET_POST_AWARD_DOCUMENTS, {
    variables: { postAwardId },
    skip: !postAwardId,
    fetchPolicy: 'cache-and-network',
  });

export const useGetPostAwardDocumentsByStage = (postAwardId: string, stage: string) =>
  useQuery<{ getPostAwardDocumentsByStage: PostAwardDocumentItem[] }>(
    GET_POST_AWARD_DOCUMENTS_BY_STAGE,
    {
      variables: { postAwardId, stage },
      skip: !postAwardId || !stage,
      fetchPolicy: 'cache-and-network',
    },
  );

export const useUploadPostAwardDocument = () =>
  useMutation<
    { uploadPostAwardDocument: PostAwardDocumentItem },
    {
      input: {
        postAwardId: string;
        tenderId: string;
        stage: string;
        documentType: string;
        documentName: string;
        documentUrl: string;
        remarks?: string;
      };
    }
  >(UPLOAD_POST_AWARD_DOCUMENT, {
    refetchQueries: [GET_POST_AWARD_DOCUMENTS],
  });

export const useDeletePostAwardDocument = () =>
  useMutation<{ deletePostAwardDocument: boolean }, { id: string }>(
    DELETE_POST_AWARD_DOCUMENT,
    { refetchQueries: [GET_POST_AWARD_DOCUMENTS] },
  );

/** Document type options per post-award stage */
export const STAGE_DOCUMENT_TYPES: Record<string, { value: string; label: string }[]> = {
  ORDER_FOLLOWUP: [
    { value: 'LOA', label: 'Letter of Acceptance (LOA)' },
    { value: 'PO', label: 'Purchase Order' },
    { value: 'EMD_RETURN', label: 'EMD Return Document' },
    { value: 'OTHER', label: 'Other' },
  ],
  ORDER_PROCESSING: [
    { value: 'PO', label: 'Purchase Order' },
    { value: 'SECURITY_DEPOSIT', label: 'Security Deposit' },
    { value: 'MOA', label: 'Modification of Advice' },
    { value: 'EXTENSION', label: 'Extension Document' },
    { value: 'OTHER', label: 'Other' },
  ],
  INSPECTION: [
    { value: 'INSPECTION_CERT', label: 'Inspection Certificate' },
    { value: 'TPI_REPORT', label: 'TPI Report' },
    { value: 'OTHER', label: 'Other' },
  ],
  DISPATCH_DELIVERY: [
    { value: 'SALES_INVOICE', label: 'Sales Invoice' },
    { value: 'EWAY_BILL', label: 'E-Way Bill' },
    { value: 'TEST_REPORT', label: 'Test Report' },
    { value: 'WARRANTY_CERT', label: 'Warranty Certificate' },
    { value: 'PROOF_OF_DELIVERY', label: 'Proof of Delivery' },
    { value: 'LDC_INVOICE', label: 'LDC Invoice' },
    { value: 'RECEIPT_NOTE', label: 'Receipt Note' },
    { value: 'OTHER', label: 'Other' },
  ],
  WARRANTY: [
    { value: 'JOINT_REPORT', label: 'Joint Inspection Report' },
    { value: 'REJECTION_WITHDRAWAL', label: 'Rejection Withdrawal' },
    { value: 'RECOVERY_REFUND', label: 'Recovery / Refund' },
    { value: 'SUPPLEMENTARY_INVOICE', label: 'Supplementary Invoice' },
    { value: 'OTHER', label: 'Other' },
  ],
  BILL_PAYMENT: [
    { value: 'BILL', label: 'Bill' },
    { value: 'DEBIT_NOTE', label: 'Debit Note' },
    { value: 'COMMISSION_INVOICE', label: 'Commission Invoice' },
    { value: 'SD_RELEASE', label: 'SD Release Document' },
    { value: 'OTHER', label: 'Other' },
  ],
};
