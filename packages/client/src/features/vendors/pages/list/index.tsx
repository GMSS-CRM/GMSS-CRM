import { useMemo, useCallback } from 'react';
import { Table, Tag, Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Vendor } from '../../types';
import Button from '../../../../components/button';
import styles from './styles.module.css';

interface VendorListProps {
  vendors: Vendor[];
  onView: (vendor: Vendor) => void;
  onCreate: () => void;
  loading?: boolean;
}

/**
 * Vendor List Page
 * Displays vendors in a table with view/edit actions
 */
export default function VendorList({
  vendors,
  onView,
  onCreate,
  loading = false,
}: VendorListProps) {
  // Filter active (non-deleted) vendors
  const activeVendors = useMemo(() => {
    return vendors.filter((vendor) => !vendor.isDeleted);
  }, [vendors]);

  const handleView = useCallback(
    (vendor: Vendor) => {
      onView(vendor);
    },
    [onView]
  );

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Submitted':
        return 'processing';
      case 'Rejected':
        return 'error';
      case 'Draft':
        return 'default';
      default:
        return 'default';
    }
  }, []);

  const columns: ColumnsType<Vendor> = useMemo(
    () => [
      {
        title: 'Vendor Name',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '25%',
        render: (name: string) => (
          <span className={styles.vendorName}>{name}</span>
        ),
      },
      {
        title: 'Vendor Type',
        dataIndex: 'vendorType',
        key: 'vendorType',
        width: '15%',
        render: (type: string) => (
          <span className={styles.vendorType}>{type}</span>
        ),
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        width: '10%',
        align: 'center',
        render: (tags: string[]) => (
          <span className={styles.tagsCount}>
            {tags.length > 0 ? tags.length : '—'}
          </span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        render: (status: string) => (
          <Tag color={getStatusColor(status)}>{status}</Tag>
        ),
      },
      {
        title: 'Created Date',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width: '15%',
        render: (date: string) => (
          <span className={styles.secondaryText}>{formatDate(date)}</span>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '12%',
        align: 'center',
        render: (_: unknown, record: Vendor) => (
          <Space size="small">
            <Tooltip title="View/Edit">
              <Button
                variant="ghost"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(record);
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [formatDate, getStatusColor, handleView]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vendors</h1>
          <p className={styles.subtitle}>Manage registered vendors</p>
        </div>
        <Button
          variant="primary"
          size="large"
          icon={<EditOutlined />}
          onClick={onCreate}
        >
          Create Vendor
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={activeVendors}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} vendors`,
            position: ['bottomCenter'],
          }}
          className={styles.table}
          onRow={(record) => ({
            onClick: () => handleView(record),
            className: styles.tableRow,
          })}
        />
      </div>
    </div>
  );
}
