import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Statistic, Tag, Row, Col } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const { Text } = Typography;

interface CountdownTimerProps {
  tenderId?: string;
  tenderTitle: string;
  dueDate?: string | null;
  onStop?: (reason: 'filled' | 'not_interested' | 'extended', details?: Record<string, any>) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  tenderTitle,
  dueDate
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
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
  }, [dueDate]);

  const isUrgent = timeRemaining.days < 3 && !timeRemaining.isExpired;
  const isExpired = timeRemaining.isExpired;

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
                ⏰ EXPIRED
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
{/* 
        <Col>
          <Space size={4}>
            <Button
              icon={isPaused ? <PlayOutlined /> : <PauseOutlined />}
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
            >
              <Button icon={<StopOutlined />} danger size="small" title="Stop countdown" />
            </Popover>
          </Space>
        </Col> */}
      </Row>
    </Card>
  );
};

export default CountdownTimer;
