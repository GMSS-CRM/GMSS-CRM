import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Statistic, Tag, Row, Col, Popover, Button, DatePicker, Input, message } from 'antd';
import { ClockCircleOutlined, StopOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMutation } from '@apollo/client/react';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const { Text } = Typography;

const SILENCE_COUNTDOWN = gql`
  mutation SilenceTenderCountdown($tenderId: ID!, $reason: TenderStatus!, $newDeadline: String, $remarks: String) {
    silenceTenderCountdown(tenderId: $tenderId, reason: $reason, newDeadline: $newDeadline, remarks: $remarks) {
      id
      status
      countdownSilenceReason
    }
  }
`;

interface CountdownTimerProps {
  tenderId?: string;
  tenderTitle: string;
  dueDate?: string | null;
  onStop?: (reason: string, details?: Record<string, any>) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  tenderId,
  tenderTitle,
  dueDate,
  onStop,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [showStopOptions, setShowStopOptions] = useState(false);
  const [newDeadline, setNewDeadline] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  const [silenceCountdown, { loading: silencing }] = useMutation(SILENCE_COUNTDOWN);

  useEffect(() => {
    if (isPaused) return;

    const calculateTimeRemaining = () => {
      const now = dayjs();
      const dueDateTime = dayjs(dueDate);
      const diff = dueDateTime.diff(now);

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const dur = dayjs.duration(diff);
      setTimeRemaining({
        days: Math.floor(dur.asDays()),
        hours: dur.hours(),
        minutes: dur.minutes(),
        seconds: dur.seconds(),
        isExpired: false,
      });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(timer);
  }, [dueDate, isPaused]);

  const handleSilence = async (reason: 'FILLED' | 'NOT_INTERESTED_TENDER' | 'DEADLINE_EXTENDED') => {
    if (!tenderId) return;

    try {
      await silenceCountdown({
        variables: {
          tenderId,
          reason,
          newDeadline: reason === 'DEADLINE_EXTENDED' ? newDeadline : null,
          remarks: remarks || undefined,
        },
      });

      const reasonLabel =
        reason === 'FILLED' ? 'filled' :
        reason === 'NOT_INTERESTED_TENDER' ? 'not-interested' : 'extend';

      message.success(
        reason === 'FILLED' ? 'Tender marked as filled' :
        reason === 'NOT_INTERESTED_TENDER' ? 'Marked as not interested' :
        'Tender deadline extended',
      );

      onStop?.(reasonLabel, { newDeadline });
      setShowStopOptions(false);
      setRemarks('');
      setNewDeadline(null);
    } catch (err: any) {
      message.error(err.message || 'Failed to silence countdown');
    }
  };

  const isUrgent = timeRemaining.days < 3 && !timeRemaining.isExpired;
  const isExpired = timeRemaining.isExpired;

  const stopMenu = (
    <div style={{ width: 240 }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Button block onClick={() => handleSilence('FILLED')} loading={silencing}>
          Filled / Position Taken
        </Button>
        <Button block onClick={() => handleSilence('NOT_INTERESTED_TENDER')} loading={silencing}>
          Not Interested
        </Button>
        <DatePicker
          placeholder="New deadline"
          style={{ width: '100%' }}
          onChange={(_, dateStr) => setNewDeadline(dateStr as string)}
        />
        <Input.TextArea
          rows={2}
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Button
          block
          type="primary"
          onClick={() => handleSilence('DEADLINE_EXTENDED')}
          disabled={!newDeadline}
          loading={silencing}
        >
          Extend Deadline
        </Button>
      </Space>
    </div>
  );

  return (
    <Card
      size="small"
      style={{
        borderLeft: `4px solid ${isExpired ? '#ff4d4f' : isUrgent ? '#faad14' : '#1890ff'}`,
        borderRadius: 4,
      }}
    >
      <Row gutter={[16, 8]} align="middle">
        <Col flex="auto">
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text ellipsis strong style={{ fontSize: 12, color: '#1890ff' }}>
              {tenderTitle}
            </Text>

            {isExpired ? (
              <Tag color="red" icon={<ClockCircleOutlined />}>
                EXPIRED
              </Tag>
            ) : (
              <Row gutter={[16, 0]}>
                <Col span={6}>
                  <Statistic
                    title="Days"
                    value={timeRemaining.days}
                    suffix="d"
                    valueStyle={{ fontSize: 14, color: isUrgent ? '#faad14' : '#1890ff' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Hours"
                    value={timeRemaining.hours}
                    suffix="h"
                    valueStyle={{ fontSize: 14 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Min"
                    value={timeRemaining.minutes}
                    suffix="m"
                    valueStyle={{ fontSize: 14 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Sec"
                    value={timeRemaining.seconds}
                    suffix="s"
                    valueStyle={{ fontSize: 12 }}
                  />
                </Col>
              </Row>
            )}
          </Space>
        </Col>

        {tenderId && (
          <Col>
            <Space size={4}>
              <Button
                icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                onClick={() => setIsPaused(!isPaused)}
                size="small"
                title={isPaused ? 'Resume' : 'Pause'}
              />
              <Popover
                content={stopMenu}
                trigger="click"
                open={showStopOptions}
                onOpenChange={setShowStopOptions}
                placement="bottomRight"
                title="Silence Countdown"
              >
                <Button icon={<StopOutlined />} danger size="small" title="Stop countdown" />
              </Popover>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default CountdownTimer;
