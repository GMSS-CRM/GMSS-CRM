import React, { useEffect, useState, useRef } from 'react';
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
} from 'antd';
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  MailOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useSearchTenders } from '../../services/tenders.service';
import type { Tender, TenderTag, TenderStatus } from '@gmss/types';
import styles from './styles.module.css';

const { Title, Text } = Typography;

// ─── Countdown hook ───────────────────────────────────────────────────────────

function calcCountdown(targetDate: string): { timeLeft: string; isUrgent: boolean } {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { timeLeft: 'Expired', isUrgent: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const isUrgent = days <= 3;
  const timeLeft = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  return { timeLeft, isUrgent };
}

// ─── Row component with per-row countdown ────────────────────────────────────

const CountdownCell: React.FC<{ deadline?: string | null }> = ({ deadline }) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initial = deadline ? calcCountdown(deadline) : { timeLeft: '—', isUrgent: false };
  const [display, setDisplay] = useState(initial);

  useEffect(() => {
    if (!deadline) return;
    timerRef.current = setInterval(() => {
      setDisplay(calcCountdown(deadline));
    }, 60_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [deadline]);

  if (!deadline) return <Text type="secondary">—</Text>;
  return (
    <Space size={4}>
      <ClockCircleOutlined style={{ color: display.isUrgent ? '#ff4d4f' : '#52c41a' }} />
      <Text style={{ color: display.isUrgent ? '#ff4d4f' : undefined, fontWeight: display.isUrgent ? 600 : 400 }}>
        {display.timeLeft}
      </Text>
    </Space>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const LiveTendersPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, loading, refetch } = useSearchTenders({ status: 'MAIL_SENT' as TenderStatus });
  const allTenders: Tender[] = data?.searchTenders ?? [];

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
    },
    {
      title: 'Submission Deadline',
      key: 'deadline',
      width: 160,
      render: (_: unknown, record: Tender) => (
        <CountdownCell deadline={record.submissionDeadline} />
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
