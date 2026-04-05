import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { VendorTender, Ticket } from '@gmss/types';

// ─── Search Queries ────────────────────────────────────────────────────────────

export const SEARCH_TENDERS = gql`
  query SearchTenders($searchTerm: String!) {
    searchTenders(searchTerm: $searchTerm, includeExpired: true) {
      id
      name
      referenceNumber
      issuingDepartment
      description
      status
      submissionDeadline
      createdDate
      tags {
        id
        tag {
          id
          name
        }
      }
      documents {
        id
        documentName
      }
    }
  }
`;

export const SEARCH_VENDORS = gql`
  query SearchVendors($searchTerm: String!) {
    searchVendors(searchTerm: $searchTerm) {
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
      tags {
        id
        tag {
          id
          name
        }
      }
    }
  }
`;

export const SEARCH_TICKETS = gql`
  query SearchTickets($searchTerm: String!) {
    searchTickets(searchTerm: $searchTerm) {
      id
      title
      description
      priority
      status
      assignedTo
      createdDate
    }
  }
`;

export const GET_VENDOR_TENDERS = gql`
  query GetVendorTenders($vendorId: ID!) {
    getVendorTenders(vendorId: $vendorId) {
      id
      vendorId
      tenderId
      interestStatus
      proposalShared
      quoteReceived
      quotedAmount
      quoteApproved
      tender {
        id
        name
        referenceNumber
        status
        submissionDeadline
      }
    }
  }
`;

// ─── Search Hooks ─────────────────────────────────────────────────────────────

interface SearchTendersResult {
  id: string;
  name: string;
  referenceNumber: string;
  issuingDepartment: string;
  description?: string;
  status: string;
  submissionDeadline?: string;
  createdDate: string;
  tags: Array<{ id: string; tag: { id: string; name: string } }>;
  documents?: Array<{ id: string; documentName: string }>;
}

interface SearchVendorsResult {
  id: string;
  name: string;
  status: string;
  type: string;
  contactPersons: Array<{ id: string; name: string; email: string; phoneNumber: string; designation: string }>;
  tags: Array<{ id: string; tag: { id: string; name: string } }>;
}

export const useSearchTenders = (searchTerm: string) => {
  const isValidTerm = searchTerm && searchTerm.length >= 2;
  
  const { data, loading, error } = useQuery<{ searchTenders: SearchTendersResult[] }>(
    SEARCH_TENDERS,
    {
      variables: { searchTerm: searchTerm || '' },
      skip: !isValidTerm,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    }
  );

  return {
    tenders: isValidTerm ? (data?.searchTenders ?? []) : [],
    loading: isValidTerm ? loading : false,
    error: isValidTerm ? error : undefined,
  };
};

export const useSearchVendors = (searchTerm: string) => {
  const isValidTerm = searchTerm && searchTerm.length >= 2;
  
  const { data, loading, error } = useQuery<{ searchVendors: SearchVendorsResult[] }>(
    SEARCH_VENDORS,
    {
      variables: { searchTerm: searchTerm || '' },
      skip: !isValidTerm,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    }
  );

  return {
    vendors: isValidTerm ? (data?.searchVendors ?? []) : [],
    loading: isValidTerm ? loading : false,
    error: isValidTerm ? error : undefined,
  };
};

export const useSearchTickets = (searchTerm: string) => {
  const isValidTerm = searchTerm && searchTerm.length >= 2;

  const { data, loading, error } = useQuery<{ searchTickets: Ticket[] }>(
    SEARCH_TICKETS,
    {
      variables: { searchTerm: searchTerm || '' },
      skip: !isValidTerm,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  );

  return {
    tickets: isValidTerm ? (data?.searchTickets ?? []) : [],
    loading: isValidTerm ? loading : false,
    error: isValidTerm ? error : undefined,
  };
};

export const useGetVendorTenders = (vendorId: string | null) => {
  const { data, loading, error, refetch } = useQuery<{ getVendorTenders: VendorTender[] }>(
    GET_VENDOR_TENDERS,
    {
      variables: { vendorId: vendorId ?? '' },
      skip: !vendorId,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    vendorTenders: data?.getVendorTenders ?? [],
    loading,
    error,
    refetch,
  };
};
