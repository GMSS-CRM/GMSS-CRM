import {
  FileTextOutlined,
  ShopOutlined,
  AlertOutlined,
  BellOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Table, Tag, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDashboardSummary } from './services/dashboard.service';
import styles from './styles.module.css';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'default',
  OPEN: 'blue',
  APPLIED: 'cyan',
  WON: 'green',
  LOST: 'red',
  CANCELLED: 'volcano',
  FILLED: 'purple',
  NOT_INTERESTED_TENDER: 'orange',
  DEADLINE_EXTENDED: 'gold',
};

const STAGE_COLORS: Record<string, string> = {
  ORDER_FOLLOWUP: '#1890ff',
  LOA_PROCESSING: '#722ed1',
  ORDER_PROCESSING: '#13c2c2',
  INSPECTION: '#eb2f96',
  DISPATCH_DELIVERY: '#fa8c16',
  WARRANTY: '#faad14',
  BILL_PAYMENT: '#52c41a',
  SD_RETURN: '#2f54eb',
  CLOSED: '#8c8c8c',
};

export default function DashboardPage() {
  const { summary, loading } = useDashboardSummary();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={styles.container}>
        <Empty description="Unable to load dashboard data" />
      </div>
    );
  }

  const recentTenderColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Ref #',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status] ?? 'default'}>
          {status?.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'submissionDeadline',
      key: 'deadline',
      width: 120,
      render: (d: string) =>
        d ? new Date(d).toLocaleDateString('en-IN') : '\u2014',
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard} hoverable onClick={() => navigate('/tender-workflow')}>
            <Statistic
              title="Total Tenders"
              value={summary.totalTenders}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard} hoverable onClick={() => navigate('/vendors')}>
            <Statistic
              title="Total Vendors"
              value={summary.totalVendors}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Open Tickets"
              value={summary.totalOpenTickets}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Unread Notifications"
              value={summary.unreadNotifications}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Tenders by Status */}
        <Col xs={24} md={12}>
          <Card title="Tenders by Status" className={styles.chartCard}>
            {summary.tendersByStatus.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No tenders yet" />
            ) : (
              <div className={styles.barChart}>
                {summary.tendersByStatus.map((item) => (
                  <div key={item.status} className={styles.barRow}>
                    <span className={styles.barLabel}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${Math.min(
                            100,
                            (item.count / Math.max(...summary.tendersByStatus.map((s) => s.count))) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                    <span className={styles.barValue}>{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Post-Award Pipeline */}
        <Col xs={24} md={12}>
          <Card title="Post-Award Pipeline" className={styles.chartCard}>
            {summary.postAwardByStage.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No post-award records" />
            ) : (
              <div className={styles.pipeline}>
                {summary.postAwardByStage.map((item) => (
                  <div key={item.stage} className={styles.pipelineItem}>
                    <div
                      className={styles.pipelineDot}
                      style={{ backgroundColor: STAGE_COLORS[item.stage] ?? '#8c8c8c' }}
                    />
                    <span className={styles.pipelineLabel}>
                      {item.stage.replace(/_/g, ' ')}
                    </span>
                    <span className={styles.pipelineCount}>{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Tenders */}
      <Card
        title={
          <span>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            Recent Tenders
          </span>
        }
        className={styles.recentCard}
        extra={
          <a onClick={() => navigate('/tender-workflow')} className={styles.viewAllLink}>
            View All <ArrowRightOutlined />
          </a>
        }
      >
        <Table
          dataSource={summary.recentTenders}
          columns={recentTenderColumns}
          rowKey="id"
          pagination={false}
          size="small"
          onRow={(record) => ({
            onClick: () => navigate(`/tender-workflow/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>
    </div>
  );
}

