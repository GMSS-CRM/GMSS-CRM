import { useMemo, useState } from 'react';
import { Table, Tag, Space, Tooltip, Select } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Tender, TenderStatus } from '../../types';
import Button from '../../../../components/button';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils';
import styles from './styles.module.css';

interface TenderListComponentProps {
  tenders: Tender[];
  onView: (tender: Tender) => void;
  onCreate: () => void;
  loading?: boolean;
}

export default function TenderListComponent({
  tenders,
  onView,
  onCreate,
  loading = false,
}: TenderListComponentProps) {
  const [statusFilter, setStatusFilter] = useState<TenderStatus | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tenders.forEach((tender) => {
      tender.categories.forEach((cat) => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [tenders]);

  const filteredTenders = useMemo(() => {
    return tenders.filter((tender) => {
      if (statusFilter && tender.status !== statusFilter) return false;
      if (categoryFilter && !tender.categories.includes(categoryFilter)) return false;
      return true;
    });
  }, [tenders, statusFilter, categoryFilter]);

  const columns: ColumnsType<Tender> = useMemo(
    () => [
      {
        title: 'Tender ID',
        dataIndex: 'tenderId',
        key: 'tenderId',
        width: '12%',
        render: (id: string) => (
          <span className={styles.tenderId}>{id}</span>
        ),
      },
      {
        title: 'Tender Title',
        dataIndex: 'title',
        key: 'title',
        width: '28%',
        render: (title: string) => (
          <span className={styles.tenderTitle}>{title}</span>
        ),
      },
      {
        title: 'Department',
        dataIndex: 'issuingDepartment',
        key: 'issuingDepartment',
        width: '18%',
        render: (dept: string) => (
          <span className={styles.department}>{dept}</span>
        ),
      },
      {
        title: 'Categories',
        dataIndex: 'categories',
        key: 'categories',
        width: '12%',
        align: 'center',
        render: (categories: string[]) => (
          <span className={styles.tagsCount}>
            {categories.length > 0 ? categories.length : '—'}
          </span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        render: (status: TenderStatus) => (
          <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
        ),
      },
      {
        title: 'Closing Date',
        dataIndex: 'closingDate',
        key: 'closingDate',
        width: '12%',
        render: (date?: Date) => (
          <span className={styles.secondaryText}>{formatDate(date)}</span>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '10%',
        align: 'center',
        render: (_: unknown, record: Tender) => (
          <Space size="small">
            <Tooltip title="View/Edit">
              <Button
                variant="ghost"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(record);
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [getStatusColor, getStatusLabel]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tenders</h1>
          <p className={styles.subtitle}>Manage published and draft tenders</p>
        </div>
        <div className={styles.headerActions}>
          <Select
            placeholder="Filter by Status"
            style={{ width: 160 }}
            size="large"
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
              { label: 'Closed', value: 'closed' },
            ]}
          />
          <Select
            placeholder="Filter by Category"
            style={{ width: 180 }}
            size="large"
            allowClear
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categories.map((cat) => ({ label: cat, value: cat }))}
          />
          <Button
            variant="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onCreate}
          >
            Create Tender
          </Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={filteredTenders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tenders`,
            position: ['bottomCenter'],
          }}
          className={styles.table}
          onRow={(record) => ({
            onClick: () => onView(record),
            className: styles.tableRow,
          })}
        />
      </div>
    </div>
  );
}
