// packages/client/src/features/tags/pages/TagsListPage.tsx
import { useState, useMemo } from 'react';
import { Button, Modal } from 'antd';
import {
  PlusOutlined,
  TagsOutlined,
  TeamOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import TagTable from '../components/TagTable';
import TagSearchBar from '../components/TagSearchBar';
import CreateTagModal from './CreateTagModal';
import DeleteTagModal from './DeleteTagModal';
import type { TagWithVendorCount } from '../types/tagTypes';
import { useTagsData, useTagMutations } from '../hooks/useTagData';
import styles from '../styles/tags.module.css';
import TagTendersDrawer from './TagTenderDrawer';

export default function TagsListPage() {
  const { tags, loading, refetch, stats } = useTagsData();
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagWithVendorCount | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTag, setDrawerTag] = useState<TagWithVendorCount | null>(null);

  const { createTag, deleteTag, deleteTags, loading: mutationLoading } = useTagMutations(() => {
    refetch();
  });

  const filteredTags = useMemo(() => {
    if (!searchText.trim()) return tags;
    const search = searchText.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(search));
  }, [tags, searchText]);

  const handleView = (tag: TagWithVendorCount) => { setDrawerTag(tag); setDrawerOpen(true); };
  const handleDelete = (tag: TagWithVendorCount) => { setSelectedTag(tag); setDeleteModalOpen(true); };

  const handleConfirmDelete = async () => {
    if (!selectedTag) return;
    await deleteTag(selectedTag.id, selectedTag.name);
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
        await deleteTags(selectedRowKeys as string[]);
        setSelectedRowKeys([]);
      },
    });
  };

  const handleCreateTag = async (values: { name: string }) => {
    const success = await createTag(values);
    if (success) setCreateModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* ── Compact Header with inline stats ── */}
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h2 className={styles.pageTitle}>
            <TagsOutlined className={styles.titleIcon} />
            Tag Management
          </h2>
          <p className={styles.pageSubtitle}>
            Organize and manage vendor tags for efficient categorization
          </p>
        </div>

        {/* Inline stat pills */}
        <div className={styles.headerStats}>
          <div className={styles.headerStatItem}>
            <TagsOutlined className={styles.headerStatIcon} style={{ color: '#1677ff' }} />
            <span className={styles.headerStatValue}>{loading ? '–' : stats.totalTags}</span>
            <span className={styles.headerStatLabel}>Total Tags</span>
          </div>
          <div className={styles.headerStatDivider} />
          <div className={styles.headerStatItem}>
            <TeamOutlined className={styles.headerStatIcon} style={{ color: '#52c41a' }} />
            <span className={styles.headerStatValue}>{loading ? '–' : stats.totalAssignments}</span>
            <span className={styles.headerStatLabel}>Assigned Vendors</span>
          </div>
          <div className={styles.headerStatDivider} />
          <div className={styles.headerStatItem}>
            <MailOutlined className={styles.headerStatIcon} style={{ color: '#722ed1' }} />
            <span className={styles.headerStatValue}>{loading ? '–' : stats.totalEmailEnabled}</span>
            <span className={styles.headerStatLabel}>Email Enabled</span>
          </div>
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

      {/* ── Table Section (directly below header) ── */}
      <div className={styles.tableSection}>
        <TagSearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          onRefresh={() => { refetch(); }}
          selectedCount={selectedRowKeys.length}
          onBulkDelete={handleBulkDelete}
          loading={loading}
        />
        <TagTable
          data={filteredTags}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      <CreateTagModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTag}
        loading={mutationLoading}
      />

      <DeleteTagModal
        open={deleteModalOpen}
        tag={selectedTag}
        onCancel={() => { setDeleteModalOpen(false); setSelectedTag(null); }}
        onConfirm={handleConfirmDelete}
      />

      <TagTendersDrawer
        open={drawerOpen}
        tag={drawerTag}
        onClose={() => { setDrawerOpen(false); setDrawerTag(null); }}
      />
    </div>
  );
}