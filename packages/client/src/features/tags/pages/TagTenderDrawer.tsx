// packages/client/src/features/tags/pages/TagTendersDrawer.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  Drawer, 
  Tag as AntTag, 
  Switch, 
  message,
} from 'antd';
import { 
  TagOutlined, 
  FileTextOutlined, 
  TeamOutlined,
  MailOutlined,
  RightOutlined,
  PhoneOutlined,
  InboxOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { 
  TagWithVendorCount, 
  TagTenderDisplay, 
  TenderVendorDisplay 
} from '../types/tagTypes';
import { 
  dummyTagTenders, 
  getVendorsForTender, 
  simulateDelay 
} from '../data/dummyData';
import styles from '../styles/tags.module.css';

interface TagTendersDrawerProps {
  open: boolean;
  tag: TagWithVendorCount | null;
  onClose: () => void;
}

type ViewMode = 'tenders' | 'vendors';

export default function TagTendersDrawer({
  open,
  tag,
  onClose,
}: TagTendersDrawerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('tenders');
  const [selectedTender, setSelectedTender] = useState<TagTenderDisplay | null>(null);
  const [tenders, setTenders] = useState<TagTenderDisplay[]>([]);
  const [vendors, setVendors] = useState<TenderVendorDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [vendorLoading, setVendorLoading] = useState<Record<string, boolean>>({});

  // Load tenders when tag changes
  useEffect(() => {
    if (open && tag) {
      loadTenders();
    }
    // Reset state when drawer closes
    if (!open) {
      setViewMode('tenders');
      setSelectedTender(null);
      setTenders([]);
      setVendors([]);
    }
  }, [open, tag]);

  const loadTenders = async () => {
    if (!tag) return;
    setLoading(true);
    await simulateDelay(300);
    const tagTenders = dummyTagTenders[tag.id] || [];
    setTenders(tagTenders);
    setLoading(false);
  };

  const loadVendors = async (tender: TagTenderDisplay) => {
    setLoading(true);
    await simulateDelay(300);
    const tenderVendors = getVendorsForTender(tender.id);
    setVendors(tenderVendors);
    setLoading(false);
  };

  const handleTenderClick = (tender: TagTenderDisplay) => {
    setSelectedTender(tender);
    setViewMode('vendors');
    loadVendors(tender);
  };

  const handleBackToTenders = () => {
    setViewMode('tenders');
    setSelectedTender(null);
    setVendors([]);
  };

  const handleEmailToggle = useCallback(async (
    vendorId: string, 
    vendorName: string, 
    enableMail: boolean
  ): Promise<boolean> => {
    setVendorLoading(prev => ({ ...prev, [vendorId]: true }));
    
    try {
      await simulateDelay(400);
      
      // Update local state
      setVendors(prev => 
        prev.map(v => 
          v.id === vendorId ? { ...v, enableMail } : v
        )
      );
      
      message.success(
        `Email notifications ${enableMail ? 'enabled' : 'disabled'} for ${vendorName}`
      );
      
      return true;
    } catch (error) {
      message.error('Failed to update email settings');
      return false;
    } finally {
      setVendorLoading(prev => ({ ...prev, [vendorId]: false }));
    }
  }, []);

  const getTenderStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return styles.tenderStatusActive;
      case 'closed':
        return styles.tenderStatusClosed;
      case 'draft':
        return styles.tenderStatusDraft;
      default:
        return '';
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      formatted: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      isUrgent: daysLeft <= 7 && daysLeft > 0,
      isPast: daysLeft < 0,
      daysLeft
    };
  };

  const renderBreadcrumb = () => (
    <div className={styles.breadcrumbNav}>
      <span 
        className={`${styles.breadcrumbItem} ${viewMode === 'tenders' ? styles.breadcrumbItemActive : ''}`}
        onClick={viewMode === 'vendors' ? handleBackToTenders : undefined}
      >
        <FileTextOutlined /> Tenders
      </span>
      {viewMode === 'vendors' && selectedTender && (
        <>
          <RightOutlined className={styles.breadcrumbSeparator} />
          <span className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`}>
            <TeamOutlined /> Vendors
          </span>
        </>
      )}
    </div>
  );

  const renderTenderList = () => {
    if (loading) {
      return (
        <div className={styles.loadingSkeleton}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.skeletonItem} />
          ))}
        </div>
      );
    }

    if (tenders.length === 0) {
      return (
        <div className={styles.emptyDrawerState}>
          <InboxOutlined className={styles.emptyDrawerIcon} />
          <div className={styles.emptyDrawerTitle}>No Tenders Found</div>
          <div className={styles.emptyDrawerSubtitle}>
            This tag doesn't have any tenders assigned yet
          </div>
        </div>
      );
    }

    return (
      <div className={styles.tenderList}>
        {tenders.map(tender => {
          const deadline = formatDeadline(tender.deadline);
          
          return (
            <div 
              key={tender.id} 
              className={styles.tenderCard}
              onClick={() => handleTenderClick(tender)}
            >
              <div className={styles.tenderCardHeader}>
                <div>
                  <div className={styles.tenderTitle}>
                    <FileTextOutlined style={{ color: '#722ed1' }} />
                    {tender.tenderTitle}
                  </div>
                  <div className={styles.tenderNumber}>{tender.tenderNumber}</div>
                </div>
                <span className={`${styles.tenderStatus} ${getTenderStatusClass(tender.status)}`}>
                  {tender.status}
                </span>
              </div>
              <div className={styles.tenderCardMeta}>
                <span className={styles.tenderMetaItem}>
                  <TeamOutlined />
                  {tender.vendorCount} vendors
                </span>
                <span className={styles.tenderMetaItem}>
                  <MailOutlined />
                  {tender.enabledMailCount} email active
                </span>
                {deadline && (
                  <span className={`${styles.tenderDeadline} ${deadline.isUrgent ? styles.tenderDeadlineUrgent : ''}`}>
                    <CalendarOutlined />
                    {deadline.isPast ? 'Expired' : deadline.formatted}
                    {deadline.isUrgent && ` (${deadline.daysLeft} days left)`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVendorList = () => {
    if (loading) {
      return (
        <div className={styles.loadingSkeleton}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={styles.skeletonItem} />
          ))}
        </div>
      );
    }

    if (vendors.length === 0) {
      return (
        <div className={styles.emptyDrawerState}>
          <TeamOutlined className={styles.emptyDrawerIcon} />
          <div className={styles.emptyDrawerTitle}>No Vendors Found</div>
          <div className={styles.emptyDrawerSubtitle}>
            This tender doesn't have any vendors assigned yet
          </div>
        </div>
      );
    }

    return (
      <div className={styles.vendorListContainer}>
        {vendors.map(vendor => (
          <div key={vendor.id} className={styles.vendorCard}>
            <div className={styles.vendorInfo}>
              <span className={styles.vendorName}>{vendor.vendorName}</span>
              <span className={styles.vendorEmail}>
                <MailOutlined style={{ fontSize: 11 }} />
                {vendor.vendorEmail}
              </span>
              {vendor.vendorPhone && (
                <span className={styles.vendorPhone}>
                  <PhoneOutlined style={{ fontSize: 11 }} />
                  {vendor.vendorPhone}
                </span>
              )}
            </div>
            <div className={styles.emailToggle}>
              <Switch
                checked={vendor.enableMail}
                onChange={(checked) => handleEmailToggle(vendor.id, vendor.vendorName, checked)}
                loading={vendorLoading[vendor.id]}
                size="small"
              />
              <span className={`${styles.toggleLabel} ${vendor.enableMail ? styles.toggleEnabled : styles.toggleDisabled}`}>
                {vendor.enableMail ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Drawer
      title={
        <div className={styles.drawerHeader}>
          <TagOutlined style={{ color: '#1677ff', fontSize: 18 }} />
          <span>{tag?.name || 'Tag'}</span>
          <AntTag color="blue" className={styles.drawerTagBadge}>
            {tenders.length} Tenders
          </AntTag>
        </div>
      }
      placement="right"
      width={520}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '0 24px 24px' }
      }}
    >
      {tag && (
        <>
          {/* Stats Bar */}
          <div className={styles.drawerStats}>
            <div className={styles.drawerStatItem}>
              <FileTextOutlined />
              <span className={styles.drawerStatValue}>{tag.tenderCount}</span>
              Tenders
            </div>
            <div className={styles.drawerStatItem}>
              <TeamOutlined />
              <span className={styles.drawerStatValue}>{tag.vendorCount}</span>
              Vendors
            </div>
            <div className={styles.drawerStatItem}>
              <MailOutlined />
              <span className={styles.drawerStatValue}>{tag.enabledMailCount}</span>
              Email Active
            </div>
          </div>

          {/* Breadcrumb */}
          {renderBreadcrumb()}

          {/* Selected Tender Info */}
          {viewMode === 'vendors' && selectedTender && (
            <div style={{ 
              padding: '12px 16px', 
              background: '#f9f0ff', 
              borderRadius: 8, 
              marginBottom: 16,
              border: '1px solid #d3adf7'
            }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                {selectedTender.tenderTitle}
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                {selectedTender.tenderNumber} • {selectedTender.vendorCount} vendors
              </div>
            </div>
          )}

          {/* Content */}
          {viewMode === 'tenders' ? renderTenderList() : renderVendorList()}
        </>
      )}
    </Drawer>
  );
}