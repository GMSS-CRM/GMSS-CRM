import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenerateUploadUrlInput {
  folder: string;
  fileName: string;
  contentType: string;
}

export interface UploadUrlResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export const GENERATE_PRESIGNED_UPLOAD_URL = gql`
  mutation GeneratePresignedUploadUrl($input: GenerateUploadUrlInput!) {
    generatePresignedUploadUrl(input: $input) {
      uploadUrl
      key
      publicUrl
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGenerateUploadUrl = () =>
  useMutation<
    { generatePresignedUploadUrl: UploadUrlResult },
    { input: GenerateUploadUrlInput }
  >(GENERATE_PRESIGNED_UPLOAD_URL);

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Upload a file to S3 via presigned URL.
 *
 * 1. Calls the GraphQL mutation to get a presigned upload URL
 * 2. PUTs the file directly to S3
 * 3. Returns the public URL and S3 key
 */
export async function uploadFileToS3(
  file: File,
  folder: string,
  generateUrl: ReturnType<typeof useGenerateUploadUrl>[0],
): Promise<{ publicUrl: string; key: string }> {
  const { data } = await generateUrl({
    variables: {
      input: {
        folder,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      },
    },
  });

  if (!data?.generatePresignedUploadUrl) {
    throw new Error('Failed to generate upload URL');
  }

  const { uploadUrl, key, publicUrl } = data.generatePresignedUploadUrl;

  // PUT the file directly to S3
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.statusText}`);
  }

  return { publicUrl, key };
}
