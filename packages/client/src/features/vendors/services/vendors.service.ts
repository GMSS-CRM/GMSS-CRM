import { gql } from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client/react';
import type { Vendor, VendorDocument, VendorMdRequest, ContactPerson, CompanyStatus, CompanyType } from '../types';

// ─── Type Mappers ────────────────────────────────────────────────────────────

function gqlStatusToFrontend(status: string): CompanyStatus {
  switch (status) {
    case 'NEW':                 return 'New';
    case 'INTERESTED':
    case 'PENDING_MD_APPROVAL':
    case 'NOT_INTERESTED':      return 'Interested';
    case 'APPROVED':
    case 'FINAL':               return 'Final';
    default:                    return 'New';
  }
}

function frontendStatusToGql(status: CompanyStatus): string {
  switch (status) {
    case 'New':        return 'NEW';
    case 'Interested': return 'INTERESTED';
    case 'Final':      return 'FINAL';
  }
}

function mapGqlContactPerson(cp: any): ContactPerson {
  return {
    id: cp.id,
    name: cp.name ?? '',
    designation: cp.designation,
    phone: cp.phoneNumber,
    email: {
      mailto: cp.email ? [cp.email] : [],
      cc: cp.cc ? cp.cc.split(',').map((e: string) => e.trim()).filter(Boolean) : [],
      bcc: cp.bcc ? cp.bcc.split(',').map((e: string) => e.trim()).filter(Boolean) : [],
    },
  };
}

function mapGqlVendor(v: any): Vendor {
  return {
    id: v.id,
    companyName: v.name ?? '',
    companyType: (v.type as CompanyType) ?? 'Vendor',
    isLinkedWithRailways: v.isRailwayLinked ?? false,
    address: v.address,
    gstNumber: v.gstNumber,
    panNumber: v.panNumber,
    msmeNumber: v.msmeUdyamNumber,
    cinNumber: v.cinNumber,
    tagIds: (v.tags ?? []).map((t: any) => t.tagId as string),
    tagNames: (v.tags ?? []).map((t: any) => t.tag?.name ?? ''),
    status: gqlStatusToFrontend(v.status),
    createdDate: v.createdDate ?? new Date().toISOString(),
    createdBy: v.createdBy ?? undefined,
    updatedDate: v.updatedDate,
    updatedBy: v.updatedBy ?? undefined,
    isDeleted: v.status === 'DELETED',
    contactPersons: (v.contactPersons ?? []).map(mapGqlContactPerson),
  };
}

function mapGqlDocument(d: any): VendorDocument {
  return {
    id: d.id,
    vendorId: d.vendorId,
    documentType: d.documentName ?? '',
    fileName: d.documentName,
    status: 'Pending',
    uploadedDate: d.createdDate,
    uploadedBy: d.createdBy,
    expiryDate: d.expiresOn ?? undefined,
    expired: d.expiresOn ? new Date(d.expiresOn) < new Date() : false,
  };
}

function mapGqlMdRequest(r: any): VendorMdRequest {
  return {
    id: r.id,
    vendorId: r.vendorId,
    empId: r.empId ?? '',
    empRemark: r.empRemark ?? undefined,
    mdId: r.mdId ?? undefined,
    mdRemark: r.mdRemark ?? undefined,
    isResolved: r.isResolved ?? false,
    createdDate: r.createdDate ?? new Date().toISOString(),
    resolvedDate: r.updatedDate,
  };
}

function cpToGqlInput(cp: ContactPerson) {
  return {
    name: cp.name,
    designation: cp.designation,
    phoneNumber: cp.phone ?? '',
    email: cp.email?.mailto?.[0] ?? '',
    cc: (cp.email?.cc ?? []).join(','),
    bcc: (cp.email?.bcc ?? []).join(','),
  };
}

// ─── Fragments ────────────────────────────────────────────────────────────────

const VENDOR_FIELDS = gql`
  fragment VendorFields on Vendor {
    id
    name
    type
    status
    isRailwayLinked
    gstNumber
    panNumber
    cinNumber
    msmeUdyamNumber
    address
    createdDate
    updatedDate
    createdBy
    updatedBy
    tags {
      id
      tagId
      enableMail
      tag { id name }
    }
    contactPersons {
      id
      vendorId
      name
      designation
      phoneNumber
      email
      cc
      bcc
    }
  }
`;

const MD_REQUEST_FIELDS = gql`
  fragment MdRequestFields on VendorMdRequest {
    id
    vendorId
    empId
    empRemark
    mdId
    mdRemark
    isResolved
    createdDate
    updatedDate
  }
`;

const VENDOR_DOCUMENT_FIELDS = gql`
  fragment VendorDocumentFields on VendorDocument {
    id
    vendorId
    documentName
    documentUrl
    expiresOn
    createdBy
    createdDate
    updatedBy
    updatedDate
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const SEARCH_VENDORS = gql`
  ${VENDOR_FIELDS}
  query SearchVendors($search: String, $status: VendorStatus) {
    searchVendors(search: $search, status: $status) {
      ...VendorFields
    }
  }
`;

const GET_VENDOR_BY_ID = gql`
  ${VENDOR_FIELDS}
  query GetVendorById($id: ID!) {
    getVendorById(id: $id) {
      ...VendorFields
    }
  }
`;

export const GET_PENDING_MD_REQUESTS = gql`
  ${MD_REQUEST_FIELDS}
  query GetPendingMdRequests {
    getPendingMdRequests {
      ...MdRequestFields
    }
  }
`;

export const GET_RESOLVED_MD_REQUESTS = gql`
  ${MD_REQUEST_FIELDS}
  query GetResolvedMdRequests {
    getResolvedMdRequests {
      ...MdRequestFields
    }
  }
`;

const GET_ACTIVE_PENDING_REQUEST = gql`
  ${MD_REQUEST_FIELDS}
  query GetActivePendingRequest($vendorId: ID!) {
    getActivePendingRequest(vendorId: $vendorId) {
      ...MdRequestFields
    }
  }
`;

const SEARCH_VENDOR_DOCUMENTS = gql`
  ${VENDOR_DOCUMENT_FIELDS}
  query SearchVendorDocuments($vendorId: ID) {
    searchVendorDocuments(searchInput: { vendorId: $vendorId }) {
      ...VendorDocumentFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

const CREATE_VENDOR = gql`
  ${VENDOR_FIELDS}
  mutation CreateVendor($input: CreateVendorInput!) {
    createVendor(input: $input) {
      ...VendorFields
    }
  }
`;

const UPDATE_VENDOR = gql`
  ${VENDOR_FIELDS}
  mutation UpdateVendor($id: ID!, $input: UpdateVendorInput!) {
    updateVendor(id: $id, input: $input) {
      ...VendorFields
    }
  }
`;

const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id)
  }
`;

const CHANGE_VENDOR_STATUS = gql`
  mutation ChangeVendorStatus($input: ChangeVendorStatusInput!) {
    changeVendorStatus(input: $input) {
      id
      status
    }
  }
`;

const CREATE_MD_REQUEST = gql`
  ${MD_REQUEST_FIELDS}
  mutation CreateMdRequest($input: CreateMdRequestInput!) {
    createMdRequest(input: $input) {
      ...MdRequestFields
    }
  }
`;

const RESOLVE_MD_REQUEST = gql`
  ${MD_REQUEST_FIELDS}
  mutation ResolveMdRequest($input: ResolveMdRequestInput!) {
    resolveMdRequest(input: $input) {
      ...MdRequestFields
    }
  }
`;

export const UPLOAD_VENDOR_DOCUMENT = gql`
  ${VENDOR_DOCUMENT_FIELDS}
  mutation UploadVendorDocument($input: UploadVendorDocumentInput!) {
    uploadVendorDocument(input: $input) {
      ...VendorDocumentFields
    }
  }
`;

const DELETE_VENDOR_DOCUMENT = gql`
  mutation DeleteVendorDocument($id: ID!) {
    deleteVendorDocument(id: $id)
  }
`;

// ─── Hooks ───────────────────────────────────────────────────────────────────

export const useSearchVendors = (search?: string, status?: string) => {
  const { data, loading, error, refetch } = useQuery<{ searchVendors: any[] }>(SEARCH_VENDORS, {
    variables: { search: search || undefined, status: status || undefined },
    fetchPolicy: 'cache-and-network',
  });

  return {
    vendors: (data?.searchVendors ?? []).map(mapGqlVendor) as Vendor[],
    loading,
    error,
    refetch,
  };
};

export const useGetVendorById = (id: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<{ getVendorById: any }>(GET_VENDOR_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    vendor: data?.getVendorById ? mapGqlVendor(data.getVendorById) : null,
    // raw GQL status needed to detect valid transitions on save
    rawStatus: data?.getVendorById?.status as string | undefined,
    loading,
    error,
    refetch,
  };
};

export const useGetPendingMdRequests = () => {
  const { data, loading, error, refetch } = useQuery<{ getPendingMdRequests: any[] }>(GET_PENDING_MD_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    requests: (data?.getPendingMdRequests ?? []).map(mapGqlMdRequest) as VendorMdRequest[],
    loading,
    error,
    refetch,
  };
};

export const useGetResolvedMdRequests = () => {
  const { data, loading, error, refetch } = useQuery<{ getResolvedMdRequests: any[] }>(GET_RESOLVED_MD_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    requests: (data?.getResolvedMdRequests ?? []).map(mapGqlMdRequest) as VendorMdRequest[],
    loading,
    error,
    refetch,
  };
};

export const useGetActivePendingRequest = (vendorId: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<{ getActivePendingRequest: any }>(GET_ACTIVE_PENDING_REQUEST, {
    variables: { vendorId },
    skip: !vendorId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    request: data?.getActivePendingRequest
      ? mapGqlMdRequest(data.getActivePendingRequest)
      : null,
    loading,
    error,
    refetch,
  };
};

export const useSearchVendorDocuments = (vendorId: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<{ searchVendorDocuments: any[] }>(SEARCH_VENDOR_DOCUMENTS, {
    variables: { vendorId },
    skip: !vendorId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    documents: (data?.searchVendorDocuments ?? []).map(mapGqlDocument) as VendorDocument[],
    loading,
    error,
    refetch,
  };
};

export const useCreateVendor = () => {
  const [mutate, { loading }] = useMutation<{ createVendor: any }>(CREATE_VENDOR, {
    refetchQueries: [{ query: SEARCH_VENDORS }],
  });

  const createVendor = async (values: {
    companyName: string;
    companyType: CompanyType;
    isLinkedWithRailways: boolean;
    status: CompanyStatus;
    address?: string;
    contactPersons: ContactPerson[];
    gstNumber?: string;
    panNumber?: string;
    msmeNumber?: string;
    cinNumber?: string;
    tagIds?: string[];
  }) => {
    const result = await mutate({
      variables: {
        input: {
          name: values.companyName,
          type: values.companyType,
          isRailwayLinked: values.isLinkedWithRailways,
          address: values.address,
          gstNumber: values.gstNumber,
          panNumber: values.panNumber,
          msmeUdyamNumber: values.msmeNumber,
          cinNumber: values.cinNumber,
          tagIds: values.tagIds ?? [],
          contactPersons: (values.contactPersons ?? [])
            .filter((cp) => cp.name)
            .map(cpToGqlInput),
        },
      },
    });
    return result.data?.createVendor ? mapGqlVendor(result.data.createVendor) : null;
  };

  return { createVendor, loading };
};

export const useUpdateVendor = () => {
  const [mutate, { loading }] = useMutation<{ updateVendor: any }>(UPDATE_VENDOR, {
    refetchQueries: [{ query: SEARCH_VENDORS }],
  });
  const [changeStatus] = useMutation(CHANGE_VENDOR_STATUS);

  const updateVendor = async (
    id: string,
    values: {
      companyName: string;
      companyType: CompanyType;
      isLinkedWithRailways: boolean;
      status: CompanyStatus;
      address?: string;
      contactPersons: ContactPerson[];
      gstNumber?: string;
      panNumber?: string;
      msmeNumber?: string;
      cinNumber?: string;
      tagIds?: string[];
    },
    currentGqlStatus: string,
  ) => {
    // 1. Update basic fields (no status — handled through workflow)
    const result = await mutate({
      variables: {
        id,
        input: {
          name: values.companyName,
          type: values.companyType,
          isRailwayLinked: values.isLinkedWithRailways,
          address: values.address,
          gstNumber: values.gstNumber,
          panNumber: values.panNumber,
          msmeUdyamNumber: values.msmeNumber,
          cinNumber: values.cinNumber,
          tagIds: values.tagIds ?? undefined,
          contactPersons: (values.contactPersons ?? [])
            .filter((cp) => cp.name)
            .map((cp) => ({
              id: cp.id?.startsWith('cp_') ? undefined : cp.id,
              ...cpToGqlInput(cp),
            })),
        },
      },
    });

    // 2. Handle status change via workflow if needed
    const desiredGql = frontendStatusToGql(values.status);
    if (desiredGql !== currentGqlStatus) {
      try {
        await changeStatus({
          variables: {
            input: { vendorId: id, newStatus: desiredGql, remarks: 'Status updated from form' },
          },
        });
      } catch {
        // Transition may not be valid from current status — other fields still saved
      }
    }

    return result.data?.updateVendor ? mapGqlVendor(result.data.updateVendor) : null;
  };

  return { updateVendor, loading };
};

export const useDeleteVendor = () => {
  const [mutate, { loading }] = useMutation<{ deleteVendor: boolean }>(DELETE_VENDOR, {
    refetchQueries: [{ query: SEARCH_VENDORS }],
  });

  const deleteVendor = async (id: string) => {
    await mutate({ variables: { id } });
  };

  return { deleteVendor, loading };
};

export const useCreateMdRequest = () => {
  const [mutate, { loading }] = useMutation<{ createMdRequest: any }>(CREATE_MD_REQUEST, {
    refetchQueries: [{ query: GET_PENDING_MD_REQUESTS }, { query: SEARCH_VENDORS }],
  });

  const createMdRequest = async (vendorId: string, empRemark: string) => {
    const result = await mutate({
      variables: { input: { vendorId, empRemark } },
    });
    return result.data?.createMdRequest ? mapGqlMdRequest(result.data.createMdRequest) : null;
  };

  return { createMdRequest, loading };
};

export const useResolveMdRequest = () => {
  const [mutate, { loading }] = useMutation<{ resolveMdRequest: any }>(RESOLVE_MD_REQUEST, {
    refetchQueries: [
      { query: GET_PENDING_MD_REQUESTS },
      { query: GET_RESOLVED_MD_REQUESTS },
      { query: SEARCH_VENDORS },
    ],
  });

  const resolveMdRequest = async (requestId: string, mdRemark: string, approved: boolean) => {
    const result = await mutate({
      variables: { input: { requestId, mdRemark, approved } },
    });
    return result.data?.resolveMdRequest ? mapGqlMdRequest(result.data.resolveMdRequest) : null;
  };

  return { resolveMdRequest, loading };
};

export const useUploadVendorDocument = () => {
  const [mutate, { loading }] = useMutation<{ uploadVendorDocument: any }>(UPLOAD_VENDOR_DOCUMENT);

  const uploadVendorDocument = async (
    vendorId: string,
    documentName: string,
    documentUrl: string,
    expiresOn?: string,
  ) => {
    const result = await mutate({
      variables: { input: { vendorId, documentName, documentUrl, expiresOn } },
    });
    return result.data?.uploadVendorDocument
      ? mapGqlDocument(result.data.uploadVendorDocument)
      : null;
  };

  return { uploadVendorDocument, loading };
};

export const useDeleteVendorDocument = () => {
  const [mutate, { loading }] = useMutation<{ deleteVendorDocument: boolean }>(DELETE_VENDOR_DOCUMENT);

  const deleteVendorDocument = async (id: string) => {
    await mutate({ variables: { id } });
  };

  return { deleteVendorDocument, loading };
};

// ─── Follow Up GQL ────────────────────────────────────────────────────────────

const FOLLOW_UP_FIELDS = gql`
  fragment FollowUpFields on VendorFollowUp {
    id
    vendorId
    type
    followUpStatus
    nextFollowUpDate
    remarks
    documentUrl
    documentName
    courierTrackingNumber
    courierProvider
    courierDeliveryRemarks
    autoMailSent
    isCompleted
    createdDate
    updatedDate
    createdBy
  }
`;

const GET_VENDOR_FOLLOW_UPS = gql`
  ${FOLLOW_UP_FIELDS}
  query GetVendorFollowUps($vendorId: ID!) {
    getVendorFollowUps(vendorId: $vendorId) {
      ...FollowUpFields
    }
  }
`;

const GET_SHARED_TENDERS = gql`
  query GetSharedTenders($vendorId: ID!) {
    getSharedTenders(vendorId: $vendorId) {
      id
      vendorId
      tenderId
      participationStatus
      quotedAmount
      sharedDate
      createdDate
      tender {
        id
        name
        referenceNumber
        description
        status
        submissionDeadline
        issuingDepartment
        mailSentAt
        createdBy
        createdDate
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
    }
  }
`;

const CREATE_VENDOR_FOLLOW_UP = gql`
  ${FOLLOW_UP_FIELDS}
  mutation CreateVendorFollowUp($input: CreateFollowUpInput!) {
    createVendorFollowUp(input: $input) {
      ...FollowUpFields
    }
  }
`;

const UPDATE_VENDOR_FOLLOW_UP = gql`
  ${FOLLOW_UP_FIELDS}
  mutation UpdateVendorFollowUp($input: UpdateFollowUpInput!) {
    updateVendorFollowUp(input: $input) {
      ...FollowUpFields
    }
  }
`;

const DELETE_VENDOR_FOLLOW_UP = gql`
  mutation DeleteVendorFollowUp($id: ID!) {
    deleteVendorFollowUp(id: $id)
  }
`;

// ─── Follow Up Types ──────────────────────────────────────────────────────────

export type FollowUpType = 'EMAIL' | 'HARD_COPY_COURIER' | 'DIGITAL_SIGNATURE_COURIER';
export type FollowUpStatus = 'PENDING' | 'YES_RECEIVED' | 'COURIER_DISPATCHED' | 'COMPLETED';

export interface VendorFollowUp {
  id: string;
  vendorId: string;
  type: FollowUpType;
  followUpStatus: FollowUpStatus;
  nextFollowUpDate?: string;
  remarks?: string;
  documentUrl?: string;
  documentName?: string;
  courierTrackingNumber?: string;
  courierDeliveryRemarks?: string;
  autoMailSent: boolean;
  isCompleted: boolean;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
}

function mapGqlFollowUp(f: any): VendorFollowUp {
  return {
    id: f.id,
    vendorId: f.vendorId,
    type: f.type as FollowUpType,
    followUpStatus: f.followUpStatus as FollowUpStatus,
    nextFollowUpDate: f.nextFollowUpDate ?? undefined,
    remarks: f.remarks ?? undefined,
    documentUrl: f.documentUrl ?? undefined,
    documentName: f.documentName ?? undefined,
    courierTrackingNumber: f.courierTrackingNumber ?? undefined,
    courierProvider: f.courierProvider ?? undefined,
    courierDeliveryRemarks: f.courierDeliveryRemarks ?? undefined,
    autoMailSent: f.autoMailSent ?? false,
    isCompleted: f.isCompleted ?? false,
    createdDate: f.createdDate,
    updatedDate: f.updatedDate,
    createdBy: f.createdBy,
  };
}

// ─── Follow Up Hooks ──────────────────────────────────────────────────────────

export const useGetVendorFollowUps = (vendorId: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<{ getVendorFollowUps: any[] }>(
    GET_VENDOR_FOLLOW_UPS,
    { variables: { vendorId }, skip: !vendorId, fetchPolicy: 'cache-and-network' }
  );

  return {
    followUps: (data?.getVendorFollowUps ?? []).map(mapGqlFollowUp) as VendorFollowUp[],
    loading,
    error,
    refetch,
  };
};

export const useCreateVendorFollowUp = () => {
  const [mutate, { loading }] = useMutation<{ createVendorFollowUp: any }>(
    CREATE_VENDOR_FOLLOW_UP
  );

  const createFollowUp = async (input: {
    vendorId: string;
    type: FollowUpType;
    remarks?: string;
    nextFollowUpDate?: string;
    courierTrackingNumber?: string;
    courierProvider?: string;
    courierDeliveryRemarks?: string;
  }) => {
    const result = await mutate({ variables: { input } });
    return result.data?.createVendorFollowUp
      ? mapGqlFollowUp(result.data.createVendorFollowUp)
      : null;
  };

  return { createFollowUp, loading };
};

export const useUpdateVendorFollowUp = () => {
  const [mutate, { loading }] = useMutation<{ updateVendorFollowUp: any }>(
    UPDATE_VENDOR_FOLLOW_UP
  );

  const updateFollowUp = async (input: {
    followUpId: string;
    followUpStatus?: FollowUpStatus;
    remarks?: string;
    nextFollowUpDate?: string;
    documentUrl?: string;
    documentName?: string;
    courierTrackingNumber?: string;
    courierDeliveryRemarks?: string;
    isCompleted?: boolean;
  }) => {
    const result = await mutate({ variables: { input } });
    return result.data?.updateVendorFollowUp
      ? mapGqlFollowUp(result.data.updateVendorFollowUp)
      : null;
  };

  return { updateFollowUp, loading };
};

export const useDeleteVendorFollowUp = () => {
  const [mutate, { loading }] = useMutation<{ deleteVendorFollowUp: boolean }>(
    DELETE_VENDOR_FOLLOW_UP
  );

  const deleteFollowUp = async (id: string) => {
    await mutate({ variables: { id } });
  };

  return { deleteFollowUp, loading };
};

// ─── Shared Tenders Hook ──────────────────────────────────────────────────────

export interface SharedTender {
  id: string;
  vendorId: string;
  tenderId: string;
  participationStatus: string;
  quotedAmount?: number;
  sharedDate?: string;
  createdDate: string;
  tender?: {
    id: string;
    name: string;
    referenceNumber: string;
    description?: string;
    status: string;
    submissionDeadline?: string;
    issuingDepartment?: string;
    mailSentAt?: string;
    createdBy: string;
    createdDate: string;
    tags?: Array<{
      id: string;
      tenderId: string;
      tagId: string;
      tag?: {
        id: string;
        name: string;
      };
    }>;
  };
}

export const useGetSharedTenders = (vendorId: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<{ getSharedTenders: SharedTender[] }>(
    GET_SHARED_TENDERS,
    { variables: { vendorId }, skip: !vendorId, fetchPolicy: 'cache-and-network' }
  );

  return {
    sharedTenders: (data?.getSharedTenders ?? []) as SharedTender[],
    loading,
    error,
    refetch,
  };
};

// ─── Agreement Types ─────────────────────────────────────────────────────────

export interface VendorAgreement {
  id: string;
  vendorId: string;
  agreementStartDate: string;
  agreementEndDate: string;
  renewalReminderDate?: string;
  signatureStatus: 'PENDING' | 'SIGNED' | 'EXPIRED';
  signedDate?: string;
  commissionType?: 'PERCENTAGE' | 'FIXED';
  commissionValue?: number;
  commissionStructure?: 'SPLIT_50_50' | 'FULL_ON_PAYMENT';
  paymentFrequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  paymentAmount?: number;
  gstApplicable: boolean;
  hasOtherBenefits: boolean;
  otherBenefitsDescription?: string;
  createdDate: string;
  updatedDate: string;
}

// ─── Agreement GraphQL ────────────────────────────────────────────────────────

const GET_VENDOR_AGREEMENTS = gql`
  query GetVendorAgreements($vendorId: ID!) {
    getVendorAgreements(vendorId: $vendorId) {
      id
      vendorId
      agreementStartDate
      agreementEndDate
      renewalReminderDate
      signatureStatus
      signedDate
      commissionType
      commissionValue
      commissionStructure
      paymentFrequency
      paymentAmount
      gstApplicable
      hasOtherBenefits
      otherBenefitsDescription
      createdDate
      updatedDate
    }
  }
`;

const CREATE_VENDOR_AGREEMENT = gql`
  mutation CreateVendorAgreement($input: CreateAgreementInput!) {
    createVendorAgreement(input: $input) {
      id
      vendorId
      agreementStartDate
      agreementEndDate
      signatureStatus
      commissionType
      commissionValue
      commissionStructure
      paymentFrequency
      paymentAmount
      gstApplicable
      hasOtherBenefits
      otherBenefitsDescription
      createdDate
      updatedDate
    }
  }
`;

const UPDATE_AGREEMENT_SIGNATURE = gql`
  mutation UpdateAgreementSignature($input: UpdateSignatureInput!) {
    updateAgreementSignature(input: $input) {
      id
      signatureStatus
      signedDate
      updatedDate
    }
  }
`;

const CALCULATE_COMMISSION = gql`
  query CalculateVendorCommission(
    $baseAmount: Float!
    $commissionType: CommissionType!
    $commissionValue: Float!
    $gstApplicable: Boolean!
  ) {
    calculateVendorCommission(
      baseAmount: $baseAmount
      commissionType: $commissionType
      commissionValue: $commissionValue
      gstApplicable: $gstApplicable
    ) {
      baseAmount
      commissionAmount
      gstAmount
      totalAmount
    }
  }
`;

// ─── Agreement Hooks ──────────────────────────────────────────────────────────

export const useGetVendorAgreements = (vendorId: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<{ getVendorAgreements: VendorAgreement[] }>(
    GET_VENDOR_AGREEMENTS,
    { variables: { vendorId }, skip: !vendorId, fetchPolicy: 'cache-and-network' }
  );
  return { agreements: data?.getVendorAgreements ?? [], loading, error, refetch };
};

export const useCreateVendorAgreement = () => {
  const [mutate, { loading }] = useMutation(CREATE_VENDOR_AGREEMENT, {
    refetchQueries: [GET_VENDOR_AGREEMENTS],
  });
  const createAgreement = (input: Omit<VendorAgreement, 'id' | 'signatureStatus' | 'createdDate' | 'updatedDate'>) =>
    mutate({ variables: { input } });
  return { createAgreement, loading };
};

export const useUpdateAgreementSignature = () => {
  const [mutate, { loading }] = useMutation(UPDATE_AGREEMENT_SIGNATURE, {
    refetchQueries: [GET_VENDOR_AGREEMENTS],
  });
  const updateSignature = (agreementId: string, signatureStatus: string, signedDate?: string) =>
    mutate({ variables: { input: { agreementId, signatureStatus, signedDate } } });
  return { updateSignature, loading };
};

export const useCalculateCommission = () => {
  const [query, { loading }] = useMutation<{
    calculateVendorCommission: { baseAmount: number; commissionAmount: number; gstAmount: number; totalAmount: number };
  }>(CALCULATE_COMMISSION);
  // Note: calculateVendorCommission is a Query but we expose it as lazy trigger
  return { loading };
};

export const useCalculateCommissionLazy = () => {
  const { data, loading, refetch } = useQuery<{
    calculateVendorCommission: { baseAmount: number; commissionAmount: number; gstAmount: number; totalAmount: number };
  }>(CALCULATE_COMMISSION, { skip: true });
  const calculate = (vars: { baseAmount: number; commissionType: string; commissionValue: number; gstApplicable: boolean }) =>
    refetch(vars);
  return { calculate, result: data?.calculateVendorCommission, loading };
};