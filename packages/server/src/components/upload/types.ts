export interface IS3Service {
  generatePresignedUploadUrl(
    folder: string,
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }>;

  deleteObject(key: string): Promise<void>;
}
