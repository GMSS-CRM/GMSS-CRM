import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Tooltip,
  Badge,
  Input,
  Empty,
  Spin,
  message,
} from 'antd';
import {
  ArrowRightOutlined,
  SearchOutlined,
  ReloadOutlined,
  MailOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useSearchTenders } from '../../services/tenders.service';
import type { Tender, TenderTag, TenderStatus } from '@gmss/types';
import CountdownTimer from '../../components/CountdownTimer';
import styles from './styles.module.css';

const { Title, Text } = Typography;

// ─── Page ─────────────────────────────────────────────────────────────────────

const LiveTendersPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, loading, refetch } = useSearchTenders({ status: 'MAIL_SENT' as TenderStatus });
  const allTenders: Tender[] = data?.searchTendersAdvanced ?? [];

  const filtered = allTenders.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.referenceNumber?.toLowerCase().includes(q) ||
      t.issuingDepartment?.toLowerCase().includes(q)
    );
  });

  const columns: ColumnsType<Tender> = [
    {
      title: 'Reference No.',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      width: 160,
      render: (val: string) =>
        val ? (
          <Text strong style={{ fontFamily: 'monospace' }}>{val}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Tender Name',
      dataIndex: 'name',
      key: 'name',
      render: (val: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#722ed1' }} />
          {val}
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'issuingDepartment',
      key: 'issuingDepartment',
      width: 160,
      render: (val: string) => val ?? <Text type="secondary">—</Text>,
    },
    {
      title: 'Tags',
      key: 'tags',
      width: 200,
      render: (_: unknown, record: Tender) => (
        <Space size={4} wrap>
          {(record.tags ?? []).slice(0, 3).map((tt: TenderTag) => (
            <Tag key={tt.id} color="purple" style={{ fontSize: 11 }}>
              {tt.tag?.name ?? tt.tagId}
            </Tag>
          ))}
          {(record.tags ?? []).length > 3 && (
            <Tag color="default">+{(record.tags ?? []).length - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Mail Sent',
      dataIndex: 'mailSentAt',
      key: 'mailSentAt',
      width: 140,
      render: (val: string) =>
        val ? (
          <Space size={4}>
            <MailOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: 12 }}>
              {new Date(val).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        ),
      sorter: (a: Tender, b: Tender) => {
        const dateA = a.mailSentAt ? new Date(a.mailSentAt).getTime() : 0;
        const dateB = b.mailSentAt ? new Date(b.mailSentAt).getTime() : 0;
        return dateB - dateA;
      },
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Submission Deadline',
      key: 'deadline',
      width: 280,
      render: (_: unknown, record: Tender) => (
        <CountdownTimer
          tenderId={record.id}
          tenderTitle={record.name}
          dueDate={record.submissionDeadline ?? undefined}
          onStop={(reason: string, details?: { newDeadline?: string }) => {
            if (reason === 'extend' && details?.newDeadline) {
              message.success('Tender deadline extended');
            } else if (reason === 'filled') {
              message.success('Tender marked as filled');
            } else if (reason === 'not-interested') {
              message.info('Marked as not interested');
            }
            // Optionally refetch to reflect status changes
            refetch?.();
          }}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: unknown, record: Tender) => (
        <Tooltip title="Open post-award">
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate(`/tender-workflow/${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Live Tenders
          </Title>
          <Text type="secondary">
            Tenders where mail has been sent — currently in active follow-up or post-award stage
          </Text>
        </div>
        <Space>
          <Badge count={allTenders.length} color="green" overflowCount={99}>
            <Tag color="green" style={{ fontSize: 13, padding: '4px 10px' }}>
              {allTenders.length} Active
            </Tag>
          </Badge>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Search */}
      <div className={styles.toolbar}>
        <Input
          placeholder="Search by name, reference no. or department…"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 380 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.center}>
          <Spin size="large" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.center}>
          <Empty
            description={
              search ? 'No tenders match your search' : 'No live tenders found'
            }
          />
        </div>
      ) : (
        <Table<Tender>
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20, showSizeChanger: false }}
          onRow={(record) => ({
            onClick: () => navigate(`/tender-workflow/${record.id}`),
            style: { cursor: 'pointer' },
          })}
          className={styles.table}
        />
      )}
    </div>
  );
};

export default LiveTendersPage;
