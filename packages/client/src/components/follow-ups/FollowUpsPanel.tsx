import { useState, useCallback } from 'react';
import {
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Table,
  Tag,
  Space,
  message,
  Tooltip,
  Upload,
  Typography,
  Empty,
  Badge,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  MailOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { RcFile } from 'antd/es/upload';

const { TextArea } = Input;
const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

export type FollowUpType = 'EMAIL' | 'HARD_COPY_COURIER' | 'DIGITAL_SIGNATURE_COURIER';
export type FollowUpStatus = 'PENDING' | 'YES_RECEIVED' | 'COURIER_DISPATCHED' | 'COMPLETED';

export interface FollowUp {
  id: string;
  vendorId?: string;
  entityId: string; // Generic entity reference
  type: FollowUpType;
  followUpStatus: FollowUpStatus;
  nextFollowUpDate?: string;
  remarks?: string;
  documentUrl?: string;
  documentName?: string;
  courierTrackingNumber?: string;
  courierProvider?: string;
  courierDeliveryRemarks?: string;
  autoMailSent: boolean;
  isCompleted: boolean;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
}

export interface FollowUpsPanelProps {
  entityId: string | undefined;
  entityLabel?: string; // e.g., "Vendor", "Tender" (for UI labels)
  followUps: FollowUp[];
  loading?: boolean;
  onCreateFollowUp: (input: {
    entityId: string;
    type: FollowUpType;
    remarks?: string;
    nextFollowUpDate?: string;
    courierTrackingNumber?: string;
    courierProvider?: string;
    courierDeliveryRemarks?: string;
  }) => Promise<void>;
  onUpdateFollowUp: (input: {
    followUpId: string;
    followUpStatus?: FollowUpStatus;
    remarks?: string;
    nextFollowUpDate?: string;
    documentUrl?: string;
    documentName?: string;
    courierTrackingNumber?: string;
    courierProvider?: string;
    courierDeliveryRemarks?: string;
    isCompleted?: boolean;
  }) => Promise<void>;
  onDeleteFollowUp: (id: string) => Promise<void>;
  onUploadFile?: (file: RcFile, folder: string) => Promise<{ publicUrl: string }>;
  refetch?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FLOW_TYPES: { key: FollowUpType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    key: 'EMAIL',
    label: 'Follow ups',
    icon: <MailOutlined />,
    description: 'Track email follow-ups for proposals. Set reminders and record when proposal is received.',
  },
  {
    key: 'HARD_COPY_COURIER',
    label: 'Agreement Hard Copy by Courier',
    icon: <CarOutlined />,
    description: 'Track hard copy courier follow-ups. Record courier details and delivery status.',
  },
  {
    key: 'DIGITAL_SIGNATURE_COURIER',
    label: 'Digital Signature by Courier',
    icon: <SafetyCertificateOutlined />,
    description: 'Track digital signature retrieval by courier. Record dispatch and delivery details.',
  },
];

const STATUS_CONFIG: Record<FollowUpStatus, { color: string; label: string; icon: React.ReactNode }> = {
  PENDING: { color: 'warning', label: 'Pending', icon: <ClockCircleOutlined /> },
  YES_RECEIVED: { color: 'processing', label: 'Received', icon: <CheckCircleOutlined /> },
  COURIER_DISPATCHED: { color: 'blue', label: 'Courier Dispatched', icon: <CarOutlined /> },
  COMPLETED: { color: 'success', label: 'Completed', icon: <CheckCircleOutlined /> },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d?: string) {
  if (!d) return '—';
  return dayjs(d).format('DD MMM YYYY');
}

function isOverdue(d?: string) {
  if (!d) return false;
  return dayjs(d).isBefore(dayjs(), 'day');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FollowUpsPanel({
  entityId,
  followUps,
  loading = false,
  onCreateFollowUp,
  onUpdateFollowUp,
  onDeleteFollowUp,
  onUploadFile,
  refetch,
}: FollowUpsPanelProps) {
  const [activeTab, setActiveTab] = useState<FollowUpType>('EMAIL');

  // ── Modals ────────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();
  
  const [receivedOpen, setReceivedOpen] = useState(false);
  const [receivedForm] = Form.useForm();
  const [courierOpen, setCourierOpen] = useState(false);
  const [courierForm] = Form.useForm();
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderForm] = Form.useForm();

  // ── Mutation states ───────────────────────────────────────────────────────
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [uploadFile, setUploadFile] = useState<RcFile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const tabFollowUps = followUps.filter((f) => f.type === activeTab);

  // ── Handlers ──────────────────────────────────────────────────────────────
  // ── Unified Create/Edit Handler ──────────────────────────────────────────
  
  const handleSaveFollowUp = useCallback(async () => {
    try {
      const values = await form.validateFields();
      
      if (modalMode === 'create') {
        setIsCreating(true);
        const isCourierType = activeTab === 'HARD_COPY_COURIER' || activeTab === 'DIGITAL_SIGNATURE_COURIER';
        await onCreateFollowUp({
          entityId: entityId!,
          type: activeTab,
          remarks: values.remarks,
          nextFollowUpDate: values.nextFollowUpDate?.toISOString(),
          ...(isCourierType && {
            courierTrackingNumber: values.courierTrackingNumber,
            courierProvider: values.courierProvider,
            courierDeliveryRemarks: values.courierDeliveryRemarks,
          }),
        });
        message.success('Follow up created');
      } else {
        setIsUpdating(true);
        await onUpdateFollowUp({
          followUpId: selectedFollowUp!.id,
          remarks: values.remarks,
          nextFollowUpDate: values.nextFollowUpDate?.toISOString(),
        });
        message.success('Follow up updated');
      }
      
      form.resetFields();
      setModalOpen(false);
      setSelectedFollowUp(null);
      refetch?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg) message.error(errorMsg);
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  }, [form, modalMode, selectedFollowUp, onCreateFollowUp, onUpdateFollowUp, entityId, activeTab, refetch]);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    form.resetFields();
    setSelectedFollowUp(null);
    setModalOpen(true);
  }, [form]);

  const openEditModal = useCallback((followUp: FollowUp) => {
    setModalMode('edit');
    setSelectedFollowUp(followUp);
    form.setFieldsValue({
      remarks: followUp.remarks,
      nextFollowUpDate: followUp.nextFollowUpDate ? dayjs(followUp.nextFollowUpDate) : undefined,
    });
    setModalOpen(true);
  }, [form]);

  const handleMarkReceived = useCallback(async () => {
    if (!selectedFollowUp) return;
    try {
      const values = await receivedForm.validateFields();
      setIsUploading(true);

      let docUrl: string | undefined;
      let docName: string | undefined;

      if (uploadFile && onUploadFile) {
        docName = uploadFile.name;
        try {
          const result = await onUploadFile(uploadFile, 'follow-ups');
          docUrl = result.publicUrl;
        } catch {
          message.warning('File upload failed — saving entry without document URL');
          docUrl = uploadFile.name;
        }
      }

      setIsUpdating(true);
      await onUpdateFollowUp({
        followUpId: selectedFollowUp.id,
        followUpStatus: 'YES_RECEIVED',
        remarks: values.remarks,
        documentUrl: docUrl,
        documentName: docName,
      });
      message.success('Marked as Received');
      receivedForm.resetFields();
      setUploadFile(null);
      setReceivedOpen(false);
      setSelectedFollowUp(null);
      refetch?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg) message.error(errorMsg);
    } finally {
      setIsUploading(false);
      setIsUpdating(false);
    }
  }, [selectedFollowUp, receivedForm, uploadFile, onUploadFile, onUpdateFollowUp, refetch]);

  const handleSetCourier = useCallback(async () => {
    if (!selectedFollowUp) return;
    try {
      const values = await courierForm.validateFields();
      setIsUpdating(true);
      await onUpdateFollowUp({
        followUpId: selectedFollowUp.id,
        followUpStatus: 'COURIER_DISPATCHED',
        courierTrackingNumber: values.courierTrackingNumber,
        courierProvider: values.courierProvider,
        courierDeliveryRemarks: values.courierDeliveryRemarks,
        nextFollowUpDate: values.nextFollowUpDate?.toISOString(),
      });
      message.success('Courier details saved');
      courierForm.resetFields();
      setCourierOpen(false);
      setSelectedFollowUp(null);
      refetch?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg) message.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedFollowUp, courierForm, onUpdateFollowUp, refetch]);

  const handleSetReminder = useCallback(async () => {
    if (!selectedFollowUp) return;
    try {
      const values = await reminderForm.validateFields();
      setIsUpdating(true);
      await onUpdateFollowUp({
        followUpId: selectedFollowUp.id,
        nextFollowUpDate: values.nextFollowUpDate.toISOString(),
        remarks: values.remarks,
      });
      message.success('Reminder set');
      reminderForm.resetFields();
      setReminderOpen(false);
      setSelectedFollowUp(null);
      refetch?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg) message.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedFollowUp, reminderForm, onUpdateFollowUp, refetch]);

  const handleMarkComplete = useCallback(
    async (followUp: FollowUp) => {
      try {
        setIsUpdating(true);
        await onUpdateFollowUp({
          followUpId: followUp.id,
          isCompleted: true,
          followUpStatus: 'COMPLETED',
        });
        message.success('Follow up completed');
        refetch?.();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        if (errorMsg) message.error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdateFollowUp, refetch]
  );

  const handleDelete = useCallback(
    async (followUp: FollowUp) => {
      try {
        setIsUpdating(true);
        await onDeleteFollowUp(followUp.id);
        message.success('Follow up deleted');
        refetch?.();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        if (errorMsg) message.error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    },
    [onDeleteFollowUp, refetch]
  );

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns: ColumnsType<FollowUp> = [
    {
      title: 'Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 100,
      render: (d: string) => (
        <Text style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)' }}>{fmtDate(d)}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'followUpStatus',
      key: 'followUpStatus',
      width: 140,
      render: (status: FollowUpStatus) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <Tag color={cfg.color} icon={cfg.icon} style={{ fontSize: 12 }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (remarks?: string) => (
        <Text style={{ color: remarks ? undefined : 'var(--text-muted, #9ca3af)', fontSize: 13 }}>
          {remarks ?? '—'}
        </Text>
      ),
    },
    {
      title: 'Next Follow Up',
      dataIndex: 'nextFollowUpDate',
      key: 'nextFollowUpDate',
      width: 140,
      render: (d?: string) => {
        if (!d)
          return (
            <Text style={{ color: 'var(--text-muted, #9ca3af)' }}>—</Text>
          );
        const overdue = isOverdue(d);
        return (
          <Space size={4}>
            <CalendarOutlined
              style={{ color: overdue ? '#ff4d4f' : '#8c8c8c', fontSize: 12 }}
            />
            <Text
              style={{
                color: overdue ? '#ff4d4f' : undefined,
                fontSize: 13,
                fontWeight: overdue ? 600 : 400,
              }}
            >
              {fmtDate(d)}
            </Text>
            {overdue && (
              <Tag color="error" style={{ fontSize: 10, padding: '0 4px' }}>
                Overdue
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Document',
      dataIndex: 'documentName',
      key: 'documentName',
      width: 120,
      render: (name?: string, record?: FollowUp) => {
        if (!name)
          return (
            <Text style={{ color: 'var(--text-muted, #9ca3af)' }}>—</Text>
          );
        return (
          <Tooltip title={record?.documentUrl}>
            <Button
              type="link"
              size="small"
              icon={<FileTextOutlined />}
              style={{ padding: 0, fontSize: 12 }}
            >
              {name.length > 12 ? `${name.slice(0, 12)}…` : name}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: 'Courier Tracking',
      dataIndex: 'courierTrackingNumber',
      key: 'courierTrackingNumber',
      width: 140,
      render: (num?: string) =>
        num ? (
          <Text copyable={{ text: num }} style={{ fontSize: 12 }}>
            {num.length > 16 ? `${num.slice(0, 16)}…` : num}
          </Text>
        ) : (
          <Text style={{ color: 'var(--text-muted, #9ca3af)', fontSize: 12 }}>—</Text>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      align: 'center' as const,
      render: (_: unknown, record: FollowUp) => {
        if (record.isCompleted) {
          return (
            <Space size={4}>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Done
              </Tag>
              <Tooltip title="Delete">
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record)}
                />
              </Tooltip>
            </Space>
          );
        }

        const hasReceived =
          record.type === 'EMAIL' ||
          record.type === 'HARD_COPY_COURIER';
        const hasCourier =
          record.type === 'HARD_COPY_COURIER' ||
          record.type === 'DIGITAL_SIGNATURE_COURIER';

        return (
          <Space size={3} wrap>
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              />
            </Tooltip>

            <Tooltip title="Set Reminder">
              <Button
                type="text"
                size="small"
                icon={<CalendarOutlined />}
                onClick={() => {
                  setSelectedFollowUp(record);
                  reminderForm.setFieldsValue({
                    remarks: record.remarks,
                    nextFollowUpDate: record.nextFollowUpDate
                      ? dayjs(record.nextFollowUpDate)
                      : undefined,
                  });
                  setReminderOpen(true);
                }}
              />
            </Tooltip>

            {hasReceived && record.followUpStatus === 'PENDING' && (
              <Tooltip title="Mark Received">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => {
                    setSelectedFollowUp(record);
                    receivedForm.resetFields();
                    setUploadFile(null);
                    setReceivedOpen(true);
                  }}
                />
              </Tooltip>
            )}

            {hasCourier && (
              <Tooltip
                title={
                  record.followUpStatus === 'COURIER_DISPATCHED'
                    ? 'Update Courier'
                    : 'Add Courier'
                }
              >
                <Button
                  type="text"
                  size="small"
                  icon={<CarOutlined style={{ color: '#1677ff' }} />}
                  onClick={() => {
                    setSelectedFollowUp(record);
                    courierForm.setFieldsValue({
                      courierTrackingNumber:
                        record.courierTrackingNumber,
                      courierDeliveryRemarks:
                        record.courierDeliveryRemarks,
                      nextFollowUpDate: record.nextFollowUpDate
                        ? dayjs(record.nextFollowUpDate)
                        : undefined,
                    });
                    setCourierOpen(true);
                  }}
                />
              </Tooltip>
            )}

            <Tooltip title="Complete">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleMarkComplete(record)}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // ── Tab items ─────────────────────────────────────────────────────────────

  const tabItems = FLOW_TYPES.map((flow) => {
    const count = followUps.filter(
      (f) => f.type === flow.key && !f.isCompleted
    ).length;
    return {
      key: flow.key,
      label: (
        <Space size={6}>
          {flow.icon}
          {flow.label}
          {count > 0 && <Badge count={count} size="small" />}
        </Space>
      ),
    };
  });

  const activeFlowConfig = FLOW_TYPES.find((t) => t.key === activeTab)!;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary, #111827)',
              }}
            >
              Follow Ups
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 13,
                color: 'var(--text-muted, #6b7280)',
              }}
            >
              {activeFlowConfig.description}
            </p>
          </div>
          {entityId && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Follow Up
            </Button>
          )}
        </div>
      </div>

      {/* Flow Type Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as FollowUpType)}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      {/* Table */}
      <Table<FollowUp>
        rowKey="id"
        dataSource={tabFollowUps}
        columns={columns}
        loading={loading || isUpdating}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span
                  style={{
                    color: 'var(--text-muted, #9ca3af)',
                    fontSize: 13,
                  }}
                >
                  No follow ups yet. Click "Add Follow Up" to create one.
                </span>
              }
            />
          ),
        }}
        rowClassName={(r) => (r.isCompleted ? 'follow-up-row-completed' : '')}
      />

      {/* ── Create/Edit Modal ── */}
      <Modal
        open={modalOpen}
        title={
          <Space>
            {activeFlowConfig.icon}
            {modalMode === 'create' 
              ? `New Follow Up — ${activeFlowConfig.label}`
              : `Edit Follow Up — ${activeFlowConfig.label}`
            }
          </Space>
        }
        onOk={handleSaveFollowUp}
        onCancel={() => {
          setModalOpen(false);
          setSelectedFollowUp(null);
          form.resetFields();
        }}
        okText={modalMode === 'create' ? 'Create' : 'Update'}
        confirmLoading={isCreating || isUpdating}
        centered
        width={620}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Remarks / Notes" name="remarks">
            <TextArea
              rows={3}
              placeholder="Enter remarks or notes about this follow up"
            />
          </Form.Item>
          <Form.Item label="Next Follow Up Date" name="nextFollowUpDate">
            <DatePicker
              style={{ width: '100%' }}
              format="DD MMM YYYY"
              placeholder="Select follow up date"
            />
          </Form.Item>
          
          {modalMode === 'create' && (activeTab === 'HARD_COPY_COURIER' || activeTab === 'DIGITAL_SIGNATURE_COURIER') && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <Text strong style={{ fontSize: 13, color: 'var(--text-muted, #6b7280)' }}>
                Courier Details
              </Text>
              <Form.Item
                label="Courier Tracking Number"
                name="courierTrackingNumber"
                rules={[{ required: true, message: 'Tracking number is required' }]}
              >
                <Input placeholder="e.g., 1234567890" allowClear />
              </Form.Item>
              <Form.Item label="Courier Provider" name="courierProvider">
                <Input placeholder="e.g. DTDC, Fedex, DHL, India Post" allowClear />
              </Form.Item>
              <Form.Item label="Delivery Status / Remarks" name="courierDeliveryRemarks">
                <TextArea
                  rows={2}
                  placeholder="e.g., Dispatched | In transit | Delivered to reception"
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* ── Set Reminder Modal ── */}
      <Modal
        open={reminderOpen}
        title={
          <Space>
            <CalendarOutlined />
            Set Reminder — Next Follow Up
          </Space>
        }
        onOk={handleSetReminder}
        onCancel={() => {
          setReminderOpen(false);
          setSelectedFollowUp(null);
        }}
        okText="Set Reminder"
        confirmLoading={isUpdating}
        centered
        width={520}
      >
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted, #6b7280)',
            marginBottom: 16,
          }}
        >
          Set the next follow-up date. An auto-mail will be sent regarding this follow up.
        </p>
        <Form
          form={reminderForm}
          layout="vertical"
        >
          <Form.Item
            label="Next Follow Up Date"
            name="nextFollowUpDate"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD MMM YYYY"
              placeholder="Select date"
            />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <TextArea
              rows={2}
              placeholder="Optional remarks"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Mark Received / Upload Modal ── */}
      <Modal
        open={receivedOpen}
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            Yes Received — Upload Document
          </Space>
        }
        onOk={handleMarkReceived}
        onCancel={() => {
          setReceivedOpen(false);
          setSelectedFollowUp(null);
          setUploadFile(null);
        }}
        okText="Mark Received"
        confirmLoading={isUpdating || isUploading}
        centered
        width={520}
      >
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted, #6b7280)',
            marginBottom: 16,
          }}
        >
          Confirm that the document was received. Optionally upload the received file.
        </p>
        <Form
          form={receivedForm}
          layout="vertical"
        >
          <Form.Item label="Remarks" name="remarks">
            <TextArea
              rows={2}
              placeholder="Any remarks on received document"
            />
          </Form.Item>
          {onUploadFile && (
            <Form.Item label="Upload Document (optional)">
              <Upload
                beforeUpload={(file) => {
                  setUploadFile(file as RcFile);
                  return false;
                }}
                onRemove={() => setUploadFile(null)}
                maxCount={1}
                fileList={
                  uploadFile
                    ? [
                        {
                          uid: '-1',
                          name: uploadFile.name,
                          status: 'done' as const,
                        },
                      ]
                    : []
                }
              >
                <Button icon={<UploadOutlined />}>
                  Select File
                </Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* ── Courier Details Modal ── */}
      <Modal
        open={courierOpen}
        title={
          <Space>
            <CarOutlined style={{ color: '#1677ff' }} />
            Courier Details &amp; Tracking
          </Space>
        }
        onOk={handleSetCourier}
        onCancel={() => {
          setCourierOpen(false);
          setSelectedFollowUp(null);
        }}
        okText="Save Courier Details"
        confirmLoading={isUpdating}
        centered
        width={580}
      >
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted, #6b7280)',
            marginBottom: 16,
          }}
        >
          Enter courier tracking details and delivery information.
        </p>
        <Form
          form={courierForm}
          layout="vertical"
        >
          <Form.Item
            label="Courier Tracking Number"
            name="courierTrackingNumber"
            rules={[
              { required: true, message: 'Please enter tracking number' },
            ]}
          >
            <Input
              placeholder="e.g. DTDC1234567890 or AWB number"
              allowClear
            />
          </Form.Item>

          <Form.Item label="Courier Provider" name="courierProvider">
            <Input
              placeholder="e.g. DTDC, Fedex, DHL, India Post"
              allowClear
            />
          </Form.Item>

          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            label="Delivery Status / Remarks"
            name="courierDeliveryRemarks"
          >
            <TextArea
              rows={3}
              placeholder="e.g. Package dispatched | In transit | Delivered to reception on 10 Mar 2026"
            />
          </Form.Item>

          <Form.Item
            label="Next Follow Up Reminder Date"
            name="nextFollowUpDate"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD MMM YYYY"
              placeholder="Select reminder date (optional)"
            />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .follow-up-row-completed td {
          opacity: 0.55;
        }
      `}</style>
    </div>
  );
}
