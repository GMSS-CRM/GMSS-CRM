import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import type {
  Tag,
  CreateTagInput,
  UpdateTagInput,
  SearchTagInput,
  Tender,
  VendorTag,
} from '@gmss/types';

// ─── Fragments ────────────────────────────────────────────────────────────────

const TAG_FIELDS = gql`
  fragment TagFields on Tag {
    id
    name
    createdBy
    updatedBy
    createdDate
    updatedDate
    vendorCount
    enabledMailCount
    tenderCount
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const SEARCH_TAGS = gql`
  ${TAG_FIELDS}
  query SearchTags($searchInput: SearchTagInput) {
    searchTags(searchInput: $searchInput) {
      ...TagFields
    }
  }
`;

export const GET_TAG_BY_ID = gql`
  ${TAG_FIELDS}
  query GetTagById($id: ID!) {
    getTagById(id: $id) {
      ...TagFields
    }
  }
`;

export const GET_TENDERS_BY_TAG = gql`
  query GetTendersByTag($tagId: ID!) {
    getTendersByTag(tagId: $tagId) {
      id
      name
      createdBy
      createdDate
      updatedDate
      tags {
        id
        tagId
        tag {
          id
          name
        }
      }
    }
  }
`;

export const GET_VENDORS_BY_TAG = gql`
  query GetVendorsByTag($tagId: ID!) {
    getVendorsByTag(tagId: $tagId) {
      id
      name
      status
      createdDate
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_TAG = gql`
  ${TAG_FIELDS}
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      ...TagFields
    }
  }
`;

export const UPDATE_TAG = gql`
  ${TAG_FIELDS}
  mutation UpdateTag($id: ID!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      ...TagFields
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`;

export const DELETE_TAGS = gql`
  mutation DeleteTags($ids: [ID!]!) {
    deleteTags(ids: $ids)
  }
`;

export const UPDATE_VENDOR_TAG_EMAIL = gql`
  mutation UpdateVendorTagEmail($id: ID!, $enableMail: Boolean!) {
    updateVendorTagEmail(id: $id, enableMail: $enableMail) {
      id
      vendorId
      tagId
      enableMail
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useSearchTags = (searchInput?: SearchTagInput) =>
  useQuery<{ searchTags: Tag[] }>(SEARCH_TAGS, {
    variables: { searchInput },
    fetchPolicy: 'cache-and-network',
  });

export const useGetTagById = (id: string) =>
  useQuery<{ getTagById: Tag | null }>(GET_TAG_BY_ID, {
    variables: { id },
    skip: !id,
  });

export const useGetTendersByTag = (tagId: string | null) =>
  useQuery<{ getTendersByTag: Tender[] }>(GET_TENDERS_BY_TAG, {
    variables: { tagId },
    skip: !tagId,
    fetchPolicy: 'cache-and-network',
  });

export const useGetVendorsByTag = (tagId: string | null) =>
  useQuery<{ getVendorsByTag: Array<{ id: string; name: string; status: string; createdDate: string }> }>(GET_VENDORS_BY_TAG, {
    variables: { tagId },
    skip: !tagId,
    fetchPolicy: 'cache-and-network',
  });

export const useCreateTag = () =>
  useMutation<{ createTag: Tag }, { input: CreateTagInput }>(CREATE_TAG, {
    refetchQueries: [{ query: SEARCH_TAGS }],
  });

export const useUpdateTag = () =>
  useMutation<{ updateTag: Tag }, { id: string; input: UpdateTagInput }>(UPDATE_TAG, {
    refetchQueries: [{ query: SEARCH_TAGS }],
  });

export const useDeleteTag = () =>
  useMutation<{ deleteTag: boolean }, { id: string }>(DELETE_TAG, {
    refetchQueries: [{ query: SEARCH_TAGS }],
  });

export const useDeleteTags = () =>
  useMutation<{ deleteTags: boolean }, { ids: string[] }>(DELETE_TAGS, {
    refetchQueries: [{ query: SEARCH_TAGS }],
  });

export const useUpdateVendorTagEmail = () =>
  useMutation<{ updateVendorTagEmail: VendorTag }, { id: string; enableMail: boolean }>(
    UPDATE_VENDOR_TAG_EMAIL,
  );
