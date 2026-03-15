import React from 'react';
import { Timeline, Tag, Typography, Spin, Empty, Button, Tooltip } from 'antd';
import {
  ClockCircleOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  FileOutlined,
  UserOutlined,
  SwapOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGetTenderActivityLogs } from '../../services/activity-log.service';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface Props {
  tenderId: string;
}

const ACTION_META: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  STATUS_CHANGE: { color: 'blue', icon: <SwapOutlined />, label: 'Status Change' },
  DOCUMENT_UPLOAD: { color: 'green', icon: <FileOutlined />, label: 'Document Upload' },
  VENDOR_FOLLOW_UP: { color: 'orange', icon: <UserOutlined />, label: 'Vendor Follow-Up' },
  STAGE_ADVANCE: { color: 'purple', icon: <CheckCircleOutlined />, label: 'Stage Advanced' },
  MAIL_SENT: { color: 'cyan', icon: <MailOutlined />, label: 'Mail Sent' },
  FOLLOW_UP: { color: 'gold', icon: <ClockCircleOutlined />, label: 'Follow-Up' },
  NOTE: { color: 'default', icon: <InfoCircleOutlined />, label: 'Note' },
};

const ActivityTimeline: React.FC<Props> = ({ tenderId }) => {
  const { data, loading, refetch } = useGetTenderActivityLogs(tenderId);
  const logs = data?.getTenderActivityLogs ?? [];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No activity yet"
        style={{ padding: 16 }}
      />
    );
  }

  return (
    <>
      <div style={{ marginBottom: 12, textAlign: 'right' }}>
        <Button size="small" icon={<SyncOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Timeline
        items={logs.map((log) => {
          const meta = ACTION_META[log.action] ?? ACTION_META['NOTE'];
          const time = dayjs(log.createdDate);
          return {
            dot: meta.icon,
            color: meta.color,
            children: (
              <div style={{ paddingBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Tag color={meta.color} style={{ fontSize: 11, margin: 0 }}>
                    {meta.label}
                  </Tag>
                  <Tooltip title={time.format('DD MMM YYYY HH:mm:ss')}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {time.fromNow()}
                    </Text>
                  </Tooltip>
                </div>
                <Text style={{ fontSize: 13 }}>{log.description}</Text>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    by {log.performedBy}
                  </Text>
                </div>
              </div>
            ),
          };
        })}
      />
    </>
  );
};

export default ActivityTimeline;
