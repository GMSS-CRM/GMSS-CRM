import { useState, useCallback } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { message } from 'antd';

interface UploadProgress {
  loaded: number;
  total: number;
}

export interface FirebaseUploadResult {
  downloadUrl: string;
  path: string;
}

/**
 * Hook for uploading files to Firebase Cloud Storage
 * Automatically stores files in gmss/ folder
 * 
 * @returns { uploadFile, isLoading, progress, error }
 */
export const useFirebaseUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (
      file: File,
      subfolder: string = '', // e.g., 'tenders/tender-123/nit'
    ): Promise<FirebaseUploadResult> => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress({ loaded: 0, total: file.size });

        // Initialize Firebase Storage
        const storage = getStorage();

        // Create path: gmss/{subfolder}/{filename}
        const timestamp = Date.now();
        const filePath = `gmss/${subfolder}/${timestamp}_${file.name}`;
        const fileRef = ref(storage, filePath);

        // Upload file
        const snapshot = await uploadBytes(fileRef, file);

        // Get download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);

        setProgress({ loaded: file.size, total: file.size });

        return {
          downloadUrl,
          path: snapshot.ref.fullPath,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        message.error(`Upload failed: ${errorMsg}`);
        throw new Error(`Firebase upload failed: ${errorMsg}`);
      } finally {
        setIsLoading(false);
        setProgress(null);
      }
    },
    [],
  );

  return {
    uploadFile,
    isLoading,
    progress,
    error,
  };
};

export default useFirebaseUpload;
