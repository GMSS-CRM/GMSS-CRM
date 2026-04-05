import { useCallback, useState } from 'react';
import { Card, Empty, Tag, Space, Button, Tooltip, Input } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGetSharedTenders } from '../services/vendors.service';
import styles from './SharedTendersSection.module.css';

interface SharedTendersSectionProps {
  vendorId: string | undefined;
}

export default function SharedTendersSection({ vendorId }: SharedTendersSectionProps) {
  const navigate = useNavigate();
  const { sharedTenders, loading } = useGetSharedTenders(vendorId);
  const [search, setSearch] = useState('');

  const statusColors: Record<string, string> = {
    ACTIVE: 'blue',
    CLOSED: 'green',
    CANCELLED: 'red',
    DRAFT: 'default',
  };

  const handleViewTender = useCallback((tenderId: string) => {
    navigate(`/tender/${tenderId}`);
  }, [navigate]);

  // const stats = useMemo(() => {
  //   return {
  //     total: sharedTenders.length,
  //     active: sharedTenders.filter((t) => t.tender?.status === 'ACTIVE').length,
  //     closed: sharedTenders.filter((t) => t.tender?.status === 'CLOSED').length,
  //   };
  // }, [sharedTenders]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p>Loading shared tenders...</p>
      </div>
    );
  }

  if (sharedTenders.length === 0) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shared Tenders</h2>
          <p className={styles.sectionSubtitle}>
            Tenders for which tender notifications have been sent to this vendor
          </p>
        </div>
        <Card className={styles.card}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No tenders have been shared with this vendor yet"
            style={{ margin: '40px 0' }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Shared Tenders</h2>
          <p className={styles.sectionSubtitle}>
            Tenders for which tender notifications have been sent to this vendor
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Input
          placeholder="Search by name, reference no. or department…"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 380 }}
        />
      </div>

      {/* Stats Cards */}
      {/* <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Tenders"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Closed"
              value={stats.closed}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row> */}

      {/* Tenders Grid */}
      <div className={styles.gridContainer}>
        {sharedTenders
          .filter((vt) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            const tender = vt.tender;
            if (!tender) return false;
            return (
              tender.name?.toLowerCase().includes(q) ||
              tender.referenceNumber?.toLowerCase().includes(q) ||
              tender.issuingDepartment?.toLowerCase().includes(q) ||
              tender.status?.toLowerCase().includes(q)
            );
          })
          .map((vendorTender) => {
          const tender = vendorTender.tender;
          if (!tender) return null;

          const deadlineDate = tender.submissionDeadline ? dayjs(tender.submissionDeadline) : null;
          const isOverdue = deadlineDate && deadlineDate.isBefore(dayjs(), 'day');
          const daysLeft = deadlineDate ? deadlineDate.diff(dayjs(), 'day') : null;

          return (
            <Card
              key={vendorTender.id}
              className={styles.tenderCard}
              hoverable
              style={{
                borderLeft: `4px solid ${
                  tender.status === 'ACTIVE'
                    ? '#1890ff'
                    : tender.status === 'CLOSED'
                      ? '#52c41a'
                      : '#d9d9d9'
                }`,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <h3 className={styles.tenderName}>{tender.name}</h3>
                    <p className={styles.tenderRef}>
                      Ref: <strong>{tender.referenceNumber}</strong>
                    </p>
                  </div>
                  <Tooltip title="View Tender">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewTender(tender.id)}
                      size="small"
                    />
                  </Tooltip>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <Tag color={statusColors[tender.status] || 'default'}>{tender.status}</Tag>
                  {isOverdue && (
                    <Tag color="red" style={{ marginLeft: 8 }}>
                      OVERDUE
                    </Tag>
                  )}
                </div>
              </div>

              {tender.issuingDepartment && (
                <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-muted, #9ca3af)' }}>
                  <strong>Department:</strong> {tender.issuingDepartment}
                </div>
              )}

              {tender.description && (
                <p className={styles.tenderDescription}>{tender.description}</p>
              )}

              <div className={styles.tenderFooter}>
                <div>
                  <p className={styles.label}>Deadline</p>
                  <p className={styles.value}>
                    {deadlineDate
                      ? deadlineDate.format('DD MMM YYYY')
                      : 'Not specified'}
                  </p>
                  {daysLeft !== null && daysLeft >= 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted, #9ca3af)', marginTop: 4 }}>
                      {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                    </p>
                  )}
                </div>
                <div>
                  <p className={styles.label}>Shared On</p>
                  <p className={styles.value}>
                    {tender.mailSentAt
                      ? dayjs(tender.mailSentAt).format('DD MMM YYYY')
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              {tender.tags && tender.tags.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                  <Space size={4} wrap>
                    {tender.tags.map((tag) => (
                      <Tag key={tag.id} color="purple" style={{ fontSize: 11 }}>
                        {tag.tag?.name}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
