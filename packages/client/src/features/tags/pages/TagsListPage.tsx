// packages/client/src/features/tags/pages/TagsListPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Button, Typography, message, Modal } from 'antd';
import { 
  PlusOutlined, 
  TagsOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import TagTable from '../components/TagTable';
import TagStatsCards from '../components/TagStatsCards';
import TagSearchBar from '../components/TagSearchBar';
import CreateTagModal from './CreateTagModal';
import DeleteTagModal from './DeleteTagModal';
import type { TagWithVendorCount } from '../types/tagTypes';
import { dummyTags, simulateDelay } from '../data/dummyData';
import styles from '../styles/tags.module.css';
import TagTendersDrawer from './TagTenderDrawer';

const { Title } = Typography;

export default function TagsListPage() {
  const [tags, setTags] = useState<TagWithVendorCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagWithVendorCount | null>(null);
  
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTag, setDrawerTag] = useState<TagWithVendorCount | null>(null);

  // Load tags
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    await simulateDelay(500);
    setTags(dummyTags);
    setLoading(false);
  };

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchText.trim()) return tags;
    const search = searchText.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(search)
    );
  }, [tags, searchText]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalTags: tags.length,
      totalAssignments: tags.reduce((sum, tag) => sum + tag.vendorCount, 0),
      totalEmailEnabled: tags.reduce((sum, tag) => sum + tag.enabledMailCount, 0),
    };
  }, [tags]);

  // Handlers
  const handleView = (tag: TagWithVendorCount) => {
    setDrawerTag(tag);
    setDrawerOpen(true);
  };

  const handleDelete = (tag: TagWithVendorCount) => {
    setSelectedTag(tag);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) return;
    
    await simulateDelay(300);
    setTags(prev => prev.filter(t => t.id !== selectedTag.id));
    message.success(`Tag "${selectedTag.name}" deleted successfully`);
    setDeleteModalOpen(false);
    setSelectedTag(null);
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Delete Selected Tags',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected tags? This action cannot be undone.`,
      okText: 'Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await simulateDelay(300);
        setTags(prev => prev.filter(t => !selectedRowKeys.includes(t.id)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} tags deleted successfully`);
      },
    });
  };

  const handleCreateTag = async (values: { name: string }) => {
    await simulateDelay(300);
    const newTag: TagWithVendorCount = {
      id: `new-${Date.now()}`,
      name: values.name,
      createdBy: 'current-user@gmss.com',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      vendorCount: 0,
      enabledMailCount: 0,
      tenderCount: 0,
    };
    setTags(prev => [newTag, ...prev]);
    message.success(`Tag "${values.name}" created successfully`);
    setCreateModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <Title level={4} className={styles.pageTitle}>
            <TagsOutlined className={styles.titleIcon} />
            Tag Management
          </Title>
          <p className={styles.pageSubtitle}>
            Organize and manage vendor tags for efficient categorization
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
            className={styles.createButton}
          >
            Create Tag
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <TagStatsCards
        totalTags={stats.totalTags}
        totalAssignments={stats.totalAssignments}
        totalEmailEnabled={stats.totalEmailEnabled}
        loading={loading}
      />

      {/* Table Section */}
      <div className={styles.tableSection}>
        {/* Search & Actions Bar */}
        <TagSearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          onRefresh={loadTags}
          selectedCount={selectedRowKeys.length}
          onBulkDelete={handleBulkDelete}
          loading={loading}
        />

        {/* Table */}
        <TagTable
          data={filteredTags}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      {/* Create Modal */}
      <CreateTagModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTag}
      />

      {/* Delete Modal */}
      <DeleteTagModal
        open={deleteModalOpen}
        tag={selectedTag}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedTag(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Tenders Drawer */}
      <TagTendersDrawer
        open={drawerOpen}
        tag={drawerTag}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerTag(null);
        }}
      />
    </div>
  );
}