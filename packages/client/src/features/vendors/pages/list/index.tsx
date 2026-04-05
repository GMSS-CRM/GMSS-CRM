import { useMemo, useCallback } from 'react';
import { Tag, Space, Tooltip, Badge } from 'antd';
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
import AppTable from '../../../../components/app-table';
import VendorExcelImport from '../../components/VendorExcelImport';
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
  onRefresh,
}: VendorListProps) {
  const activeVendors = useMemo(() => vendors.filter((v) => !v.isDeleted), [vendors]);

  // Map vendorId - Vendor for request tables
  const vendorMap = useMemo(() => {
    const m = new Map<string, Vendor>();
    vendors.forEach((v) => m.set(v.id, v));
    return m;
  }, [vendors]);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
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
      width: '24%',
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
      dataIndex: 'tagNames',
      key: 'tagNames',
      width: '14%',
      render: (tagNames: string[]) => {
        if (!tagNames?.length) return <span className={styles.tagsCount}>—</span>;
        const visible = tagNames.slice(0, 2);
        const rest = tagNames.slice(2);
        return (
          <Space size={3} wrap>
            {visible.map((n) => (
              <Tag key={n} color="blue" style={{ fontSize: 11, margin: 0, padding: '1px 6px' }}>{n}</Tag>
            ))}
            {rest.length > 0 && (
              <Tooltip title={rest.join(', ')}>
                <Tag color="default" style={{ fontSize: 11, margin: 0, padding: '1px 6px', cursor: 'default' }}>+{rest.length}</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '11%',
      render: (status: string) => {
        const cfg = getStatusConfig(status);
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: '10%',
      render: (date: string) => <span className={styles.secondaryText}>{formatDate(date)}</span>,
      sorter: (a: Vendor, b: Vendor) => {
        const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return dateB - dateA;
      },
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      width: '10%',
      render: (date?: string) => <span className={styles.secondaryText}>{date ? formatDate(date) : '—'}</span>,
      sorter: (a: Vendor, b: Vendor) => {
        const dateA = a.updatedDate ? new Date(a.updatedDate).getTime() : 0;
        const dateB = b.updatedDate ? new Date(b.updatedDate).getTime() : 0;
        return dateB - dateA;
      },
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: '10%',
      render: (email?: string) => {
        if (!email) return <span className={styles.secondaryText}>—</span>;
        const display = email.includes('@') ? email.split('@')[0] : email;
        return (
          <Tooltip title={email}>
            <span className={styles.secondaryText}>{display}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: '10%',
      render: (email?: string) => {
        if (!email) return <span className={styles.secondaryText}>—</span>;
        const display = email.includes('@') ? email.split('@')[0] : email;
        return (
          <Tooltip title={email}>
            <span className={styles.secondaryText}>{display}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '11%',
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
      width: '20%',
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
      width: '11%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        if (!v) return '—';
        const cfg = getStatusConfig(v.status);
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Employee Remark',
      key: 'empRemark',
      width: '27%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.remarkText}>{req.empRemark || '—'}</span>
      ),
    },
    {
      title: 'Requested On',
      key: 'requestedOn',
      width: '12%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.secondaryText}>{formatDate(req.createdDate)}</span>
      ),
      sorter: (a: VendorMdRequest, b: VendorMdRequest) => {
        const dateA = new Date(a.createdDate).getTime();
        const dateB = new Date(b.createdDate).getTime();
        return dateB - dateA;
      },
      defaultSortOrder: 'descend' as const,
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
      width: '16%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        return <span className={styles.vendorName}>{v?.companyName ?? req.vendorId}</span>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: '10%',
      render: (_: unknown, req: VendorMdRequest) => {
        const v = vendorMap.get(req.vendorId);
        if (!v) return '—';
        const cfg = getStatusConfig(v.status);
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Employee Remark',
      key: 'empRemark',
      width: '22%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.remarkText}>{req.empRemark || '—'}</span>
      ),
    },
    {
      title: 'MD Remark',
      key: 'mdRemark',
      width: '22%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.remarkText}>{req.mdRemark || '—'}</span>
      ),
    },
    {
      title: 'Resolved On',
      key: 'resolvedOn',
      width: '12%',
      render: (_: unknown, req: VendorMdRequest) => (
        <span className={styles.secondaryText}>
          {req.resolvedDate ? formatDate(req.resolvedDate) : '—'}
        </span>
      ),
      sorter: (a: VendorMdRequest, b: VendorMdRequest) => {
        const dateA = a.resolvedDate ? new Date(a.resolvedDate).getTime() : 0;
        const dateB = b.resolvedDate ? new Date(b.resolvedDate).getTime() : 0;
        return dateB - dateA;
      },
      defaultSortOrder: 'descend' as const,
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
              MD for review.
            </span>
          )}
        </div>
      )}
      {activeView === 'resolved' && (
        <div className={styles.resolvedBanner}>
          <CheckCircleOutlined style={{ color: '#059669' }} />
          <span>
            <strong>{resolvedRequests.length}</strong> resolved request{resolvedRequests.length !== 1 ? 's' : ''}.
          </span>
        </div>
      )}

      {/*  Excel Import — Employee "All Vendors" only  */}
      {role === 'EMPLOYEE' && activeView === 'all' && (
        <VendorExcelImport onImportComplete={onRefresh} />
      )}

      {/*  Table  */}
      <div className={styles.tableContainer}>
        {activeView === 'all' && (
          <AppTable<Vendor>
            columns={allColumns}
            dataSource={activeVendors}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10, showSizeChanger: true, position: ['bottomCenter'],
              showTotal: (t) => `Total ${t} vendor${t !== 1 ? 's' : ''}`,
            }}
            className={styles.table}
            onRow={(record) => ({ onClick: () => onView(record), className: styles.tableRow })}
          />
        )}
        {activeView === 'pending' && (
          <AppTable<VendorMdRequest>
            columns={pendingColumns}
            dataSource={pendingRequests}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10, showSizeChanger: true, position: ['bottomCenter'],
              showTotal: (t) => `${t} pending request${t !== 1 ? 's' : ''}`,
            }}
            className={styles.table}
            onRow={(req) => ({ onClick: () => onViewRequest(req, 'pending'), className: styles.tableRow })}
          />
        )}
        {activeView === 'resolved' && role === 'EMPLOYEE' && (
          <AppTable<VendorMdRequest>
            columns={resolvedColumns}
            dataSource={resolvedRequests}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
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
