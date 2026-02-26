// packages/client/src/features/tags/components/TagTable.tsx
import React from 'react';
import { Button, Badge, Tooltip, Empty } from 'antd';
import { 
  EyeOutlined, 
  DeleteOutlined, 
  TagOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { TagWithVendorCount } from '../types/tagTypes';
import styles from '../styles/tags.module.css';
import AppTable from '../../../components/app-table';

interface TagTableProps {
  data: TagWithVendorCount[];
  loading: boolean;
  selectedRowKeys: React.Key[];
  onSelectChange: (keys: React.Key[]) => void;
  onView: (tag: TagWithVendorCount) => void;
  onDelete: (tag: TagWithVendorCount) => void;
}

export default function TagTable({
  data,
  loading,
  selectedRowKeys,
  onSelectChange,
  onView,
  onDelete,
}: TagTableProps) {
  const columns = [
    {
      title: 'Tag Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: TagWithVendorCount, b: TagWithVendorCount) => 
        a.name.localeCompare(b.name),
      render: (name: string) => (
        <span className={styles.tagName}>
          <TagOutlined className={styles.tagIcon} />
          {name}
        </span>
      ),
    },
    {
      title: 'Tenders',
      dataIndex: 'tenderCount',
      key: 'tenderCount',
      width: 100,
      align: 'center' as const,
      sorter: (a: TagWithVendorCount, b: TagWithVendorCount) => 
        a.tenderCount - b.tenderCount,
      render: (count: number) => (
        <Badge
          count={count}
          showZero
          className={styles.tenderBadge}
          style={{
            backgroundColor: count > 0 ? '#722ed1' : '#d9d9d9',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      title: 'Vendors',
      dataIndex: 'vendorCount',
      key: 'vendorCount',
      width: 100,
      align: 'center' as const,
      sorter: (a: TagWithVendorCount, b: TagWithVendorCount) => 
        a.vendorCount - b.vendorCount,
      render: (count: number) => (
        <Badge
          count={count}
          showZero
          className={styles.vendorBadge}
          style={{
            backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      title: 'Email Active',
      key: 'emailActive',
      width: 110,
      align: 'center' as const,
      render: (_: unknown, record: TagWithVendorCount) => {
        if (record.vendorCount === 0) {
          return <span style={{ color: '#d9d9d9' }}>—</span>;
        }
        return (
          <span style={{ fontSize: 13 }}>
            <span style={{ color: '#52c41a', fontWeight: 600 }}>
              {record.enabledMailCount}
            </span>
            <span style={{ color: '#8c8c8c' }}> / {record.vendorCount}</span>
          </span>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 120,
      sorter: (a: TagWithVendorCount, b: TagWithVendorCount) =>
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      render: (date: string) => (
        <span className={styles.dateText}>
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: TagWithVendorCount) => (
        <div className={styles.actionButtons}>
          <Tooltip title={record.tenderCount > 0 ? 'View Tenders' : 'No tenders'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              className={styles.actionBtn}
              onClick={() => onView(record)}
              disabled={record.tenderCount === 0}
            />
          </Tooltip>
          <Tooltip title="Delete Tag">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <AppTable<TagWithVendorCount>
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
      }}
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
          showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} of ${total} tags`,
        size: 'small',
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
      locale={{
        emptyText: (
          <Empty
            className={styles.emptyState}
            image={<InboxOutlined className={styles.emptyIcon} />}
            description={
              <div>
                <div className={styles.emptyTitle}>No tags found</div>
                <div className={styles.emptySubtitle}>
                  Create your first tag to start organizing vendors
                </div>
              </div>
            }
          />
        ),
      }}
    />
  );
}