import { useCallback, useState } from 'react';
import { message, Button, Modal, Input, Space, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
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

const { Text } = Typography;
const { TextArea } = Input;

interface FollowUpsSectionProps {
  vendorId: string | undefined;
}

export default function FollowUpsSection({ vendorId }: FollowUpsSectionProps) {
  const { followUps, loading, refetch } = useGetVendorFollowUps(vendorId);
  const { createFollowUp } = useCreateVendorFollowUp();
  const { updateFollowUp } = useUpdateVendorFollowUp();
  const { deleteFollowUp } = useDeleteVendorFollowUp();
  const { uploadFile } = useFirebaseUpload();
  const [introMailOpen, setIntroMailOpen] = useState(false);
  const [introMailSubject, setIntroMailSubject] = useState('Introduction — GMSS Partnership');
  const [introMailBody, setIntroMailBody] = useState(
    'Dear Sir/Madam,\n\nWe would like to introduce GMSS and explore a potential partnership opportunity.\n\nPlease find our company profile attached.\n\nBest Regards,\nGMSS Team'
  );
  const [sendingIntroMail, setSendingIntroMail] = useState(false);

  const handleSendIntroMail = useCallback(async () => {
    if (!vendorId) return;
    setSendingIntroMail(true);
    try {
      // Create a follow-up record to track the intro mail event
      await createFollowUp({
        vendorId,
        type: 'EMAIL' as FollowUpType,
        remarks: `[Intro Mail] Subject: ${introMailSubject}\n\n${introMailBody}`,
      });
      await refetch();
      setIntroMailOpen(false);
      message.success('Intro mail recorded as follow-up');
    } catch (error) {
      message.error('Failed to record intro mail');
    } finally {
      setSendingIntroMail(false);
    }
  }, [vendorId, introMailSubject, introMailBody, createFollowUp, refetch]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text strong style={{ fontSize: 15 }}>Follow-Ups</Text>
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={() => setIntroMailOpen(true)}
          disabled={!vendorId}
        >
          Send Intro Mail
        </Button>
      </div>

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

      {/* Send Intro Mail Modal */}
      <Modal
        title={
          <Space>
            <MailOutlined />
            <span>Send Introduction Mail</span>
          </Space>
        }
        open={introMailOpen}
        onCancel={() => setIntroMailOpen(false)}
        onOk={handleSendIntroMail}
        okText={sendingIntroMail ? 'Sending…' : 'Send & Record'}
        okButtonProps={{ loading: sendingIntroMail, icon: <MailOutlined /> }}
        cancelButtonProps={{ disabled: sendingIntroMail }}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Text strong style={{ fontSize: 12 }}>Subject</Text>
            <Input
              value={introMailSubject}
              onChange={(e) => setIntroMailSubject(e.target.value)}
              placeholder="Mail subject"
              disabled={sendingIntroMail}
            />
          </div>
          <div>
            <Text strong style={{ fontSize: 12 }}>Body</Text>
            <TextArea
              value={introMailBody}
              onChange={(e) => setIntroMailBody(e.target.value)}
              rows={6}
              placeholder="Mail body"
              disabled={sendingIntroMail}
            />
          </div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            This will create a follow-up record to track that an introduction mail was sent.
          </Text>
        </div>
      </Modal>
    </div>
  );
}
