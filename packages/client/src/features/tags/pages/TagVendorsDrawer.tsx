
import { Drawer, Table, Typography, Spin, Empty, Tag as AntTag } from 'antd';
import { TeamOutlined, MailOutlined, InboxOutlined } from '@ant-design/icons';
import VendorEmailToggle from '../components/VendorEmailToggle';
import { useTagVendors, useTagMutations } from '../hooks/useTagData';
import type { TagWithVendorCount, TagVendorDisplay } from '../types/tagTypes';
import styles from '../styles/tags.module.css';

const { Text } = Typography;

interface TagVendorsDrawerProps {
  open: boolean;
  onClose: () => void;
  tag: TagWithVendorCount | null;
}

export default function TagVendorsDrawer({
  open,
  onClose,
  tag,
}: TagVendorsDrawerProps) {
  const { vendors, loading, enabledCount, refetch } = useTagVendors(open ? tag?.id || null : null);
  const { toggleVendorEmail } = useTagMutations();

  const handleToggleEmail = async (
    vendorTagId: string,
    vendorName: string,
    enableMail: boolean
  ): Promise<boolean> => {
    const success = await toggleVendorEmail(vendorTagId, vendorName, enableMail);
    if (success) {
      refetch();
      return true;
    }
    return false;
  };

  const columns = [
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_: unknown, record: TagVendorDisplay) => (
        <div className={styles.vendorRow}>
          <span className={styles.vendorName}>{record.vendorName}</span>
          <span className={styles.vendorEmail}>{record.vendorEmail}</span>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MailOutlined />
          Email Status
        </span>
      ),
      key: 'enableMail',
      width: 150,
      render: (_: unknown, record: TagVendorDisplay) => (
        <VendorEmailToggle
          vendorTagId={record.id}
          vendorName={record.vendorName}
          enableMail={record.enableMail}
          onToggle={handleToggleEmail}
        />
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={560}
      title={
        <div className={styles.drawerHeader}>
          <TeamOutlined />
          <span>Vendors with tag:</span>
          <AntTag color="blue" className={styles.drawerTagBadge}>
            {tag?.name}
          </AntTag>
        </div>
      }
      extra={
        <div className={styles.drawerStats}>
          <MailOutlined />
          <span>
            <Text strong>{enabledCount}</Text> / {vendors.length} email enabled
          </span>
        </div>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#8c8c8c' }}>Loading vendors...</div>
        </div>
      ) : vendors.length === 0 ? (
        <Empty
          className={styles.emptyState}
          image={<InboxOutlined className={styles.emptyIcon} />}
          description="No vendors assigned to this tag"
        />
      ) : (
        <Table
          columns={columns}
          dataSource={vendors}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      )}
    </Drawer>
  );
}
