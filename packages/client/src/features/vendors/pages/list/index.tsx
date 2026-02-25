import { useMemo, useCallback } from 'react';
import { Table, Tag, Space, Tooltip, Badge } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Vendor, VendorMdRequest, UserRole } from '../../types';
import Button from '../../../../components/button';
import styles from './styles.module.css';

export type ActiveView = 'all' | 'pending' | 'resolved';

interface VendorListProps {
  vendors: Vendor[];
  pendingRequests: VendorMdRequest[];
  resolvedRequests: VendorMdRequest[];
  onView: (vendor: Vendor) => void;
  onViewRequest: (request: VendorMdRequest, view: 'pending' | 'resolved') => void;
  onCreate: () => void;
  loading?: boolean;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: ActiveView;
  onViewChange: (v: ActiveView) => void;
  onRefresh: () => void;
}

export default function VendorList({
  vendors,
  pendingRequests,
  resolvedRequests,
  onView,
  onViewRequest,
  onCreate,
  loading = false,
  role,
  onRoleChange,
  activeView,
  onViewChange,
}: VendorListProps) {
  const activeVendors = useMemo(() => vendors.filter((v) => !v.isDeleted), [vendors]);

  // Map vendorId - Vendor for request tables
  const vendorMap = useMemo(() => {
    const m = new Map<string, Vendor>();
    vendors.forEach((v) => m.set(v.id, v));
    return m;
  }, [vendors]);

  const formatDate = useCallback((dateString: string): string => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  }, []);

  const getStatusConfig = useCallback((status: string): { color: string; label: string } => {
    switch (status) {
      case 'New':        return { color: 'blue',    label: 'New Company' };
      case 'Interested': return { color: 'orange',  label: 'Interested'  };
      case 'Final':      return { color: 'green',   label: 'Final'       };
      default:           return { color: 'default', label: status        };
    }
  }, []);

  //  All Vendors columns 
  const allColumns: ColumnsType<Vendor> = useMemo(() => [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '28%',
      render: (name: string, record: Vendor) => (
        <div>
          <span className={styles.vendorName}>{name}</span>
          {record.isLinkedWithRailways && (
            <Tag color="geekblue" style={{ marginLeft: 8, fontSize: 11 }}>Railways</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '10%',
      align: 'center' as const,
      render: (tags: string[]) => (
        <span className={styles.tagsCount}>{tags.length > 0 ? tags.length : 'â€”'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '14%',
      render: (status: string) => {
        const cfg = getStatusConfig(status);
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: '16%',
      render: (date: string) => <span className={styles.secondaryText}>{formatDate(date)}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: Vendor) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              variant="ghost"
              icon={<EditOutlined />}
              onClick={(e) => { e.stopPropagation(); onView(record); }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ], [formatDate, getStatusConfig, onView]);

  //  Pending Requests columns 
  // Employee = view-only (eye icon); MD = edit & resolve (edit icon)
  const pendingColumns: ColumnsType<VendorMdRequest> = useMemo(() => [
    {
      title: 'Company Name',
      key: 'companyName',
      width: '22%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        return (
          <div>
            <span className={styles.vendorName}>{v?.companyName ?? req.vendorId}</span>
            {v?.isLinkedWithRailways && (
              <Tag color="geekblue" style={{ marginLeft: 8, fontSize: 11 }}>Railways</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: '12%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        if (!v) return 'â€”';
        const cfg = getStatusConfig(v.status);
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Employee Remark',
      key: 'empRemark',
      width: '30%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.remarkText}>{req.empRemark || 'â€”'}</span>
      ),
    },
    {
      title: 'Requested On',
      key: 'requestedOn',
      width: '14%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.secondaryText}>{formatDate(req.createdDate)}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, req: VendorMdRequest) => (
        <Space size="small">
          <Tooltip title={role === 'MD' ? 'Edit & Resolve' : 'View'}>
            <Button
              variant="ghost"
              icon={role === 'MD' ? <EditOutlined /> : <EyeOutlined />}
              onClick={(e) => { e.stopPropagation(); onViewRequest(req, 'pending'); }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ], [vendorMap, formatDate, getStatusConfig, onViewRequest, role]);

  //  Resolved Requests columns (Employee only) 
  const resolvedColumns: ColumnsType<VendorMdRequest> = useMemo(() => [
    {
      title: 'Company Name',
      key: 'companyName',
      width: '18%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        return <span className={styles.vendorName}>{v?.companyName ?? req.vendorId}</span>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: '11%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        if (!v) return 'â€”';
        const cfg = getStatusConfig(v.status);
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Employee Remark',
      key: 'empRemark',
      width: '24%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.remarkText}>{req.empRemark || 'â€”'}</span>
      ),
    },
    {
      title: 'MD Remark',
      key: 'mdRemark',
      width: '24%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.remarkText}>{req.mdRemark || 'â€”'}</span>
      ),
    },
    {
      title: 'Resolved On',
      key: 'resolvedOn',
      width: '13%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.secondaryText}>
          {req.resolvedDate ? formatDate(req.resolvedDate) : 'â€”'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '8%',
      align: 'center' as const,
      render: (_: unknown, req: VendorMdRequest) => (
        <Tooltip title="View">
          <Button
            variant="ghost"
            icon={<EyeOutlined />}
            onClick={(e) => { e.stopPropagation(); onViewRequest(req, 'resolved'); }}
          />
        </Tooltip>
      ),
    },
  ], [vendorMap, formatDate, getStatusConfig, onViewRequest]);

  //  View tabs 
  const viewTabs: { key: ActiveView; label: string; count?: number }[] = useMemo(() => {
    const tabs: { key: ActiveView; label: string; count?: number }[] = [
      { key: 'all',     label: 'All Vendors' },
      { key: 'pending', label: 'Pending Requests', count: pendingRequests.length },
    ];
    if (role === 'EMPLOYEE') {
      tabs.push({ key: 'resolved', label: 'Resolved', count: resolvedRequests.length });
    }
    return tabs;
  }, [pendingRequests.length, resolvedRequests.length, role]);

  return (
    <div className={styles.container}>
      {/*  Header  */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div>
            <h1 className={styles.title}>Vendors</h1>
            <p className={styles.subtitle}>Manage registered vendor companies</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.rolePill}>
            <div
              className={`${styles.roleOption} ${role === 'EMPLOYEE' ? styles.roleActive : ''}`}
              onClick={() => { onRoleChange('EMPLOYEE'); onViewChange('all'); }}
            >
              <UserOutlined /> Employee
            </div>
            <div
              className={`${styles.roleOption} ${role === 'MD' ? styles.roleActive : ''}`}
              onClick={() => { onRoleChange('MD'); onViewChange('all'); }}
            >
              <TeamOutlined /> MD
            </div>
          </div>

          {role === 'EMPLOYEE' && activeView === 'all' && (
            <Button variant="primary" icon={<PlusOutlined />} onClick={onCreate}>
              Create Vendor
            </Button>
          )}
        </div>
      </div>

      {/*  View Tabs  */}
      <div className={styles.viewTabs}>
        {viewTabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.viewTab} ${activeView === tab.key ? styles.viewTabActive : ''}`}
            onClick={() => onViewChange(tab.key)}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge
                count={tab.count}
                size="small"
                style={{ marginLeft: 6 }}
                color={tab.key === 'pending' ? '#d97706' : '#6b7280'}
              />
            )}
          </button>
        ))}
      </div>

      {/*  Context banners  */}
      {activeView === 'pending' && (
        <div className={styles.pendingBanner}>
          <ClockCircleOutlined style={{ color: '#d97706' }} />
          {role === 'MD' ? (
            <span>
              <strong>{pendingRequests.length}</strong> vendor{pendingRequests.length !== 1 ? 's' : ''} awaiting
              your review. Click the edit icon to open, edit, and resolve.
            </span>
          ) : (
            <span>
              <strong>{pendingRequests.length}</strong> vendor{pendingRequests.length !== 1 ? 's' : ''} sent to
              MD for review â€” view only until resolved.
            </span>
          )}
        </div>
      )}
      {activeView === 'resolved' && (
        <div className={styles.resolvedBanner}>
          <CheckCircleOutlined style={{ color: '#059669' }} />
          <span>
            <strong>{resolvedRequests.length}</strong> resolved request{resolvedRequests.length !== 1 ? 's' : ''} â€” showing employee and MD remarks.
          </span>
        </div>
      )}

      {/*  Table  */}
      <div className={styles.tableContainer}>
        {activeView === 'all' && (
          <Table
            columns={allColumns}
            dataSource={activeVendors}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10, showSizeChanger: true, position: ['bottomCenter'],
              showTotal: (t) => `Total ${t} vendor${t !== 1 ? 's' : ''}`,
            }}
            className={styles.table}
            onRow={(record) => ({ onClick: () => onView(record), className: styles.tableRow })}
          />
        )}
        {activeView === 'pending' && (
          <Table
            columns={pendingColumns}
            dataSource={pendingRequests}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10, showSizeChanger: true, position: ['bottomCenter'],
              showTotal: (t) => `${t} pending request${t !== 1 ? 's' : ''}`,
            }}
            className={styles.table}
            onRow={(req) => ({ onClick: () => onViewRequest(req, 'pending'), className: styles.tableRow })}
          />
        )}
        {activeView === 'resolved' && role === 'EMPLOYEE' && (
          <Table
            columns={resolvedColumns}
            dataSource={resolvedRequests}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10, showSizeChanger: true, position: ['bottomCenter'],
              showTotal: (t) => `${t} resolved request${t !== 1 ? 's' : ''}`,
            }}
            className={styles.table}
            onRow={(req) => ({ onClick: () => onViewRequest(req, 'resolved'), className: styles.tableRow })}
          />
        )}
      </div>
    </div>
  );
}
