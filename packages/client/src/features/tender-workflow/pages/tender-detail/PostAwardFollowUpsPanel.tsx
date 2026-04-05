import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Empty,
  Spin,
  Tooltip,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useGetPostAwardFollowUps,
  useCreatePostAwardFollowUp,
  useCompletePostAwardFollowUp,
  PRIORITY_OPTIONS,
} from '../../services/post-award-followups.service';
import type { PostAwardFollowUpItem } from '../../services/post-award-followups.service';

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  postAwardId: string;
  tenderId: string;
  currentStage: string;
}

const STAGE_LABELS: Record<string, string> = {
  ORDER_FOLLOWUP: 'Order Follow-Up',
  ORDER_PROCESSING: 'Order Processing',
  INSPECTION: 'Inspection',
  DISPATCH_DELIVERY: 'Dispatch & Delivery',
  WARRANTY: 'Warranty',
  BILL_PAYMENT: 'Bill & Payment',
};

const PostAwardFollowUpsPanel: React.FC<Props> = ({ postAwardId, tenderId, currentStage }) => {
  const { data, loading, refetch } = useGetPostAwardFollowUps(postAwardId);
  const [createFollowUp] = useCreatePostAwardFollowUp();
  const [completeFollowUp] = useCompletePostAwardFollowUp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [isDirtyCreate, setIsDirtyCreate] = useState(false);
  const [form] = Form.useForm();

  const followUps = data?.getPostAwardFollowUps ?? [];
  const pendingCount = followUps.filter((f) => !f.isCompleted).length;
  const overdueCount = followUps.filter(
    (f) => !f.isCompleted && f.nextFollowUpDate && dayjs(f.nextFollowUpDate).isBefore(dayjs()),
  ).length;

  const handleCreate = async (values: {
    priority: string;
    remarks?: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    followUpDate?: any;
    nextFollowUpDate?: any;
  }) => {
    setCreating(true);
    try {
      await createFollowUp({
        variables: {
          input: {
            postAwardId,
            tenderId,
            stage: currentStage,
            priority: values.priority,
            remarks: values.remarks,
            contactPerson: values.contactPerson,
            contactPhone: values.contactPhone,
            contactEmail: values.contactEmail,
            followUpDate: values.followUpDate?.toISOString(),
            nextFollowUpDate: values.nextFollowUpDate?.toISOString(),
          },
        },
      });
      message.success('Follow-up created');
      setCreateModalOpen(false);
      form.resetFields();
      setIsDirtyCreate(false);
      refetch();
    } catch {
      message.error('Failed to create follow-up');
    } finally {
      setCreating(false);
    }
  };

  const handleComplete = async () => {
    if (!completeModalOpen) return;
    setCompleting(true);
    try {
      await completeFollowUp({
        variables: { id: completeModalOpen, outcome: outcome || 'Completed' },
      });
      message.success('Follow-up completed');
      setCompleteModalOpen(null);
      setOutcome('');
      refetch();
    } catch {
      message.error('Failed to complete follow-up');
    } finally {
      setCompleting(false);
    }
  };

  const columns: ColumnsType<PostAwardFollowUpItem> = [
    {
      title: 'Stage',
      key: 'stage',
      width: 150,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {STAGE_LABELS[r.stage] ?? r.stage}
        </Text>
      ),
    },
    {
      title: 'Priority',
      key: 'priority',
      width: 100,
      render: (_, r) => {
        const opt = PRIORITY_OPTIONS.find((o) => o.value === r.priority);
        return <Tag color={opt?.color ?? 'default'}>{opt?.label ?? r.priority}</Tag>;
      },
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, r) => (
        <Space direction="vertical" size={1}>
          {r.contactPerson && <Text style={{ fontSize: 12 }}>{r.contactPerson}</Text>}
          {r.contactPhone && (
            <Text type="secondary" style={{ fontSize: 11 }}>{r.contactPhone}</Text>
          )}
          {r.contactEmail && (
            <Text type="secondary" style={{ fontSize: 11 }}>{r.contactEmail}</Text>
          )}
          {!r.contactPerson && !r.contactPhone && !r.contactEmail && (
            <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Next Follow-Up',
      key: 'nextDate',
      width: 140,
      render: (_, r) => {
        if (!r.nextFollowUpDate) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        // Strict parsing with multiple format options from backend
        const parsed = dayjs(r.nextFollowUpDate, ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DD'], true);
        const next = parsed.isValid() ? parsed : dayjs(r.nextFollowUpDate);
        const isOverdue = !r.isCompleted && next.isBefore(dayjs());
        return (
          <Tooltip title={next.format('DD MMM YYYY HH:mm')}>
            <Text
              type={isOverdue ? 'danger' : 'secondary'}
              strong={isOverdue}
              style={{ fontSize: 12 }}
            >
              {isOverdue && <ExclamationCircleOutlined style={{ marginRight: 4 }} />}
              {next.format('DD MMM YYYY')}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Remarks',
      key: 'remarks',
      render: (_, r) => (
        <Tooltip title={r.remarks}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {r.remarks
              ? r.remarks.length > 40
                ? r.remarks.slice(0, 40) + '…'
                : r.remarks
              : '—'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 110,
      render: (_, r) =>
        r.isCompleted ? (
          <Tag icon={<CheckCircleOutlined />} color="success">Done</Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="processing">Pending</Tag>
        ),
    },
    {
      title: '',
      key: 'action',
      width: 90,
      render: (_, r) =>
        !r.isCompleted ? (
          <Button
            type="link"
            size="small"
            onClick={() => { setCompleteModalOpen(r.id); setOutcome(''); }}
          >
            Complete
          </Button>
        ) : (
          <Tooltip title={r.outcome}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {r.outcome
                ? r.outcome.length > 20
                  ? r.outcome.slice(0, 20) + '…'
                  : r.outcome
                : '—'}
            </Text>
          </Tooltip>
        ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Text strong style={{ fontSize: 14 }}>
            Follow-Ups ({followUps.length})
          </Text>
          {pendingCount > 0 && (
            <Badge count={pendingCount} style={{ backgroundColor: '#1677ff' }} />
          )}
          {overdueCount > 0 && (
            <Badge count={`${overdueCount} overdue`} style={{ backgroundColor: '#ff4d4f' }} />
          )}
        </Space>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          Add Follow-Up
        </Button>
      </div>

      {followUps.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No follow-ups recorded yet" />
      ) : (
        <Table<PostAwardFollowUpItem>
          dataSource={followUps}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
        />
      )}

      {/* Create Follow-Up Modal */}
      <Modal
        title="Add Follow-Up"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); form.resetFields(); setIsDirtyCreate(false); }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} onValuesChange={() => setIsDirtyCreate(true)}>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Select priority' }]}
            initialValue="MEDIUM"
          >
            <Select
              options={PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            />
          </Form.Item>
          <Form.Item label="Contact Person" name="contactPerson">
            <Input placeholder="Officer / contact name" />
          </Form.Item>
          <Form.Item label="Contact Phone" name="contactPhone">
            <Input placeholder="Phone number" />
          </Form.Item>
          <Form.Item label="Contact Email" name="contactEmail">
            <Input placeholder="Email address" type="email" />
          </Form.Item>
          <Form.Item label="Follow-Up Date" name="followUpDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Next Follow-Up Date" name="nextFollowUpDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <TextArea rows={3} placeholder="Notes about this follow-up…" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={creating} block disabled={!isDirtyCreate}>
              Create Follow-Up
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Complete Follow-Up Modal */}
      <Modal
        title="Complete Follow-Up"
        open={!!completeModalOpen}
        onCancel={() => setCompleteModalOpen(null)}
        onOk={handleComplete}
        confirmLoading={completing}
        okText="Mark Complete"
      >
        <Form.Item label="Outcome / Result">
          <TextArea
            rows={3}
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="What was the result of this follow-up?"
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default PostAwardFollowUpsPanel;
