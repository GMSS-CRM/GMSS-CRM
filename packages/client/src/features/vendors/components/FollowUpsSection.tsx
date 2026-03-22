import { useCallback } from 'react';
import { message } from 'antd';
import type { RcFile } from 'antd/es/upload';
import FollowUpsPanel from '../../../components/follow-ups/FollowUpsPanel';
import type { FollowUp, FollowUpType } from '../../../components/follow-ups/FollowUpsPanel';
import {
  useGetVendorFollowUps,
  useCreateVendorFollowUp,
  useUpdateVendorFollowUp,
  useDeleteVendorFollowUp,
} from '../services/vendors.service';
import { useFirebaseUpload } from '../../tender-workflow/hooks/useFirebaseUpload';

interface FollowUpsSectionProps {
  vendorId: string | undefined;
}

export default function FollowUpsSection({ vendorId }: FollowUpsSectionProps) {
  const { followUps, loading, refetch } = useGetVendorFollowUps(vendorId);
  const { createFollowUp } = useCreateVendorFollowUp();
  const { updateFollowUp } = useUpdateVendorFollowUp();
  const { deleteFollowUp } = useDeleteVendorFollowUp();
  const { uploadFile } = useFirebaseUpload();

  const handleCreateFollowUp = useCallback(
    async (input: {
      entityId: string;
      type: string;
      remarks?: string;
      nextFollowUpDate?: string;
      courierTrackingNumber?: string;
      courierProvider?: string;
      courierDeliveryRemarks?: string;
    }) => {
      await createFollowUp({
        vendorId: input.entityId,
        type: input.type as FollowUpType,
        remarks: input.remarks,
        nextFollowUpDate: input.nextFollowUpDate,
        courierTrackingNumber: input.courierTrackingNumber,
        courierProvider: input.courierProvider,
        courierDeliveryRemarks: input.courierDeliveryRemarks,
      });
    },
    [createFollowUp]
  );

  const handleUpdateFollowUp = useCallback(
    async (input: Parameters<typeof updateFollowUp>[0]) => {
      await updateFollowUp(input);
    },
    [updateFollowUp]
  );

  const handleDeleteFollowUp = useCallback(
    async (id: string) => {
      await deleteFollowUp(id);
    },
    [deleteFollowUp]
  );

  const handleUploadFile = useCallback(
    async (file: RcFile, folder: string) => {
      try {
        const result = await uploadFile(file, folder);
        return { publicUrl: result.downloadUrl };
      } catch (error) {
        message.error('File upload failed');
        throw error;
      }
    },
    [uploadFile]
  );

  // Map vendor follow-ups to generic FollowUp type
  const mappedFollowUps: FollowUp[] = followUps.map((f) => ({
    ...f,
    entityId: f.vendorId,
  }));

  return (
    <div className="section" style={{ padding: '24px' }}>
      <FollowUpsPanel
        entityId={vendorId}
        entityLabel="Vendor"
        followUps={mappedFollowUps}
        loading={loading}
        onCreateFollowUp={handleCreateFollowUp}
        onUpdateFollowUp={handleUpdateFollowUp}
        onDeleteFollowUp={handleDeleteFollowUp}
        onUploadFile={handleUploadFile}
        refetch={refetch}
      />
    </div>
  );
}
