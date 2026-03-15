import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Spin,
  Empty,
  Statistic,
  Progress,
  message,
  Tooltip,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import type { VendorTender } from '@gmss/types';
import {
  useGetTenderFollowUps,
  useSeedTenderVendors,
} from '../../services/tenders.service';
import VendorDetailDrawer from './VendorDetailDrawer';
import { calcProgress, INTEREST_STATUS_META } from './vendorFollowUpUtils';

const { Text } = Typography;

interface Props {
  tenderId: string;
}

const VENDOR_TYPE_COLOURS: Record<string, string> = {
  FINAL: 'green',
  INTERESTED: 'blue',
  NEW: 'orange',
};

const ROW_BG: Record<string, string> = {
  INTERESTED:     '#f6ffed',
  NOT_INTERESTED: '#fff2f0',
  PENDING:        '#ffffff',
};

const VendorFollowUpSection: React.FC<Props> = ({ tenderId }) => {
  const { data, loading, refetch } = useGetTenderFollowUps(tenderId);
  const [seedVendors, { loading: seeding }] = useSeedTenderVendors();
  const [drawerRecord, setDrawerRecord] = useState<VendorTender | null>(null);

  const records = data?.getTenderFollowUps ?? [];

  const handleSeed = async () => {
    try {
      await seedVendors({ variables: { tenderId } });
      message.success('Vendor list synced');
    } catch {
      message.error('Failed to sync vendors');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Empty
          description={
            <span>
              No vendor entries yet.{' '}
              <Text type="secondary" style={{ fontSize: 12 }}>
                Vendors are auto-added when mail is sent. Already in Mail Sent status? Click Sync.
              </Text>
            </span>
          }
        />
        <Button
          type="primary"
          icon={<SyncOutlined />}
          loading={seeding}
          onClick={handleSeed}
          style={{ marginTop: 16 }}
        >
          Sync Vendors from Tags
        </Button>
      </div>
    );
  }

  const total      = records.length;
  const interested = records.filter((r) => r.interestStatus === 'INTERESTED').length;
  const notInt     = records.filter((r) => r.interestStatus === 'NOT_INTERESTED').length;
  const pending    = records.filter((r) => !r.interestStatus || r.interestStatus === 'PENDING').length;

  const columns: ColumnsType<VendorTender> = [
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_, r) => {
        const vendorType = r.vendor?.type ?? r.vendor?.status ?? 'FINAL';
        return (
          <Space direction="vertical" size={2}>
            <Text strong style={{ fontSize: 13 }}>{r.vendor?.name ?? r.vendorId}</Text>
            <Tag color={VENDOR_TYPE_COLOURS[vendorType] ?? 'default'} style={{ fontSize: 11 }}>
              {vendorType}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, r) => {
        const c = r.vendor?.contactPersons?.[0];
        if (!c) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return (
          <Space direction="vertical" size={1}>
            {c.name && <Text style={{ fontSize: 12 }}>{c.name}</Text>}
            <Text type="secondary" style={{ fontSize: 11 }}>{c.email}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{c.phoneNumber}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Response',
      key: 'status',
      width: 150,
      render: (_, r) => {
        const meta = INTEREST_STATUS_META[r.interestStatus ?? 'PENDING'] ?? INTEREST_STATUS_META['PENDING'];
        return (
          <Space direction="vertical" size={4}>
            <Tag color={meta.color}>{meta.label}</Tag>
            {r.interestStatus === 'NOT_INTERESTED' && r.notInterestedReason && (
              <Tooltip title={r.notInterestedReason}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {r.notInterestedReason.length > 28
                    ? r.notInterestedReason.slice(0, 28) + '…'
                    : r.notInterestedReason}
                </Text>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Quote',
      key: 'quote',
      width: 140,
      render: (_, r) => {
        if (!r.quoteReceived) return <Text type="secondary" style={{ fontSize: 12 }}>Not received</Text>;
        return (
          <Space direction="vertical" size={2}>
            {r.quotedAmount != null && (
              <Text strong style={{ fontSize: 13 }}>
                ₹{Number(r.quotedAmount).toLocaleString('en-IN')}
              </Text>
            )}
            {r.quoteApproved
              ? <Tag color="success" style={{ fontSize: 11 }}>Approved</Tag>
              : <Tag color="warning" style={{ fontSize: 11 }}>Pending Approval</Tag>
            }
          </Space>
        );
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 120,
      render: (_, r) => {
        const vendorType = r.vendor?.type ?? r.vendor?.status ?? 'FINAL';
        const draftSnap = {
          interestStatus: r.interestStatus ?? 'PENDING',
          notInterestedReason: r.notInterestedReason ?? '',
          proposalShared: r.proposalShared ?? false,
          tieUpAgreementObtained: r.tieUpAgreementObtained ?? false,
          quoteReceived: r.quoteReceived ?? false,
          quoteUrl: r.quoteUrl ?? '',
          quotedAmount: r.quotedAmount ?? null,
          quoteApproved: r.quoteApproved ?? false,
          companyDocsUploaded: r.companyDocsUploaded ?? false,
          tenderDocsUploaded: r.tenderDocsUploaded ?? false,
          emdRequired: r.emdRequired ?? false,
          emdSource: r.emdSource ?? null,
          emdAmount: r.emdAmount ?? null,
          emdPaid: r.emdPaid ?? false,
          tabulationType: r.tabulationType ?? null,
          tabulationUploaded: r.tabulationUploaded ?? false,
          tabulationApproved: r.tabulationApproved ?? false,
          participationDecisionReason: r.participationDecisionReason ?? '',
          followUpRemarks: r.followUpRemarks ?? '',
        };
        const { done, total: tot } = calcProgress(draftSnap, vendorType);
        const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
        return (
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Progress
              percent={pct}
              size="small"
              strokeColor={pct === 100 ? '#52c41a' : undefined}
              style={{ marginBottom: 0 }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>{done}/{tot} steps</Text>
          </Space>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 52,
      render: (_, r) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={(e) => { e.stopPropagation(); setDrawerRecord(r); }}
          size="small"
        />
      ),
    },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={6}>
          <Statistic title="Total Mailed" value={total} valueStyle={{ fontSize: 20 }} />
        </Col>
        <Col xs={6}>
          <Statistic title="Interested" value={interested} valueStyle={{ fontSize: 20, color: '#52c41a' }} />
        </Col>
        <Col xs={6}>
          <Statistic title="Not Interested" value={notInt} valueStyle={{ fontSize: 20, color: '#ff4d4f' }} />
        </Col>
        <Col xs={6}>
          <Statistic title="Pending" value={pending} valueStyle={{ fontSize: 20, color: '#8c8c8c' }} />
        </Col>
      </Row>

      <Table<VendorTender>
        dataSource={records}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        onRow={(r) => ({
          style: { background: ROW_BG[r.interestStatus ?? 'PENDING'] ?? '#fff', cursor: 'pointer' },
          onClick: () => setDrawerRecord(r),
        })}
      />

      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <Button size="small" icon={<SyncOutlined />} loading={seeding} onClick={handleSeed}>
          Sync Vendors
        </Button>
      </div>

      <VendorDetailDrawer
        record={drawerRecord}
        onClose={() => setDrawerRecord(null)}
        onSaved={() => { refetch(); setDrawerRecord(null); }}
      />
    </>
  );
};

export default VendorFollowUpSection;
