import { gql } from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client/react';

// ─── GraphQL Fragments ───────────────────────────────────────────────────────

const PAYMENT_TERM_FIELDS = gql`
  fragment PaymentTermFields on PaymentTerm {
    id
    vendorId
    companyType
    paymentTermType
    commissionStructure
    otherBenefits
    benefitDetails
    agreementDate
    fillAmount
    isActive
    createdDate
    createdBy
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

const GET_PAYMENT_TERMS_BY_VENDOR = gql`
  ${PAYMENT_TERM_FIELDS}
  query GetPaymentTermsByVendor($vendorId: ID!) {
    getPaymentTermsByVendor(vendorId: $vendorId) {
      ...PaymentTermFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

const CREATE_PAYMENT_TERM = gql`
  ${PAYMENT_TERM_FIELDS}
  mutation CreatePaymentTerm($input: CreatePaymentTermInput!) {
    createPaymentTerm(input: $input) {
      ...PaymentTermFields
    }
  }
`;

const UPDATE_PAYMENT_TERM = gql`
  ${PAYMENT_TERM_FIELDS}
  mutation UpdatePaymentTerm($input: UpdatePaymentTermInput!) {
    updatePaymentTerm(input: $input) {
      ...PaymentTermFields
    }
  }
`;

const DELETE_PAYMENT_TERM = gql`
  mutation DeletePaymentTerm($id: ID!) {
    deletePaymentTerm(id: $id)
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetPaymentTermsByVendor = (vendorId?: string) => {
  const { data, loading, error, refetch } = useQuery<{ getPaymentTermsByVendor: any[] }>(
    GET_PAYMENT_TERMS_BY_VENDOR,
    {
      variables: { vendorId },
      skip: !vendorId,
    }
  );

  return {
    paymentTerms: data?.getPaymentTermsByVendor ?? [],
    loading,
    error,
    refetch,
  };
};

export const useCreatePaymentTerm = () => {
  const [mutate] = useMutation<{ createPaymentTerm: any }>(CREATE_PAYMENT_TERM, {
    refetchQueries: ['GetPaymentTermsByVendor'],
  });

  return async (input: any) => {
    const result = await mutate({ variables: { input } });
    return result.data?.createPaymentTerm;
  };
};

export const useUpdatePaymentTerm = () => {
  const [mutate] = useMutation<{ updatePaymentTerm: any }>(UPDATE_PAYMENT_TERM, {
    refetchQueries: ['GetPaymentTermsByVendor'],
  });

  return async (input: any) => {
    const result = await mutate({ variables: { input } });
    return result.data?.updatePaymentTerm;
  };
};

export const useDeletePaymentTerm = () => {
  const [mutate] = useMutation<{ deletePaymentTerm: boolean }>(DELETE_PAYMENT_TERM, {
    refetchQueries: ['GetPaymentTermsByVendor'],
  });

  return async (id: string) => {
    const result = await mutate({ variables: { id } });
    return result.data?.deletePaymentTerm;
  };
};
