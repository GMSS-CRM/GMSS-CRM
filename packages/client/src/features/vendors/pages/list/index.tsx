import { useMemo, useCallback, useState } from 'react';
import { Table, Tag, Space, Tooltip, Modal, Upload, Button as AntButton, message } from 'antd';
import { EditOutlined, EyeOutlined, UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import type { Vendor } from '../../types';
import Button from '../../../../components/button';
import styles from './styles.module.css';

interface VendorListProps {
  vendors: Vendor[];
  onView: (vendor: Vendor) => void;
  onCreate: () => void;
  onUpload?: (file: File) => void;
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
  onUpload,
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

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUploadModalOpen = () => setUploadModalVisible(true);
  const handleUploadModalClose = () => {
    setUploadModalVisible(false);
    setFileList([]);
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    multiple: false,
    fileList,
    showUploadList: {
      showRemoveIcon: true,
    },
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');
      if (!isExcel) {
        message.error('Please upload a valid Excel file (.xlsx or .xls)');
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      if (onUpload) onUpload(file);
      return false;
    },
    onRemove: () => setFileList([]),
    customRequest: () => {}, // Prevent auto upload
  };

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
        <Space>
          <AntButton
            type="default"
            size="large"
            icon={<UploadOutlined />}
            onClick={handleUploadModalOpen}
          >
            Upload Vendors
          </AntButton>
          <Button
            variant="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={onCreate}
          >
            Create Vendor
          </Button>
        </Space>
      </div>
      <Modal
        open={uploadModalVisible}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><UploadOutlined /> Upload Vendors</span>}
        onCancel={handleUploadModalClose}
        footer={null}
        centered
        className={styles.uploadModal}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <b>Note:</b> Please select or drag & drop an Excel file (.xlsx or .xls) containing vendor data. Only one file can be uploaded at a time.
          </div>
        </div>
        <Upload.Dragger {...uploadProps} style={{ background: 'var(--bg-panel)' }}>
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined style={{ fontSize: 32, color: '#52c41a' }} />
          </p>
          <p className="ant-upload-text" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ color: 'var(--text-secondary)' }}>
            Only Excel files (.xlsx, .xls) are supported. Max size: 10MB.
          </p>
        </Upload.Dragger>
      </Modal>
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
