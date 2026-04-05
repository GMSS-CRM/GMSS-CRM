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
 * 
 * @param onProgress - Callback for upload progress (0-1)
 * @param abortController - Signal to abort upload
 */
export async function uploadFileToS3(
  file: File,
  folder: string,
  generateUrl: ReturnType<typeof useGenerateUploadUrl>[0],
  abortController?: AbortController,
  onProgress?: (progress: number) => void,
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

  // PUT the file directly to S3 with timeout and progress tracking
  const controller = abortController || new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000); // 10 minute timeout

  try {
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = e.loaded / e.total;
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        clearTimeout(timeoutId);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ publicUrl, key });
        } else {
          reject(new Error(`S3 upload failed: ${xhr.statusText}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        clearTimeout(timeoutId);
        reject(new Error('Network error during upload'));
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Upload aborted'));
      });

      // Setup abort listener
      if (abortController) {
        abortController.signal.addEventListener('abort', () => xhr.abort());
      }

      // Start upload
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.send(file);
    });
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
