import React, { useState, useMemo } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, TagsOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TagStatsCards from '../components/TagStatsCards';
import TagSearchBar from '../components/TagSearchBar';
import TagTable from '../components/TagTable';
import CreateTagModal from './CreateTagModal';
import EditTagModal from './EditTagModal';
import DeleteTagModal from './DeleteTagModal';
import TagVendorsDrawer from './TagVendorsDrawer';
import { useTagsData, useTagMutations } from '../hooks/useTagData';
import type { TagWithVendorCount } from '../types/tagTypes';
import styles from '../styles/tags.module.css';

export default function TagsListPage() {
  // Data hooks
  const { tags, loading, stats, refetch } = useTagsData();
  const { createTag, updateTag, deleteTag, deleteTags, loading: mutationLoading } = useTagMutations(refetch);

  // Search & Selection
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorsDrawerOpen, setVendorsDrawerOpen] = useState(false);

  // Selected tag for operations
  const [selectedTag, setSelectedTag] = useState<TagWithVendorCount | null>(null);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchText.trim()) return tags;
    const search = searchText.toLowerCase();
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search)
    );
  }, [tags, searchText]);

  // Handlers
  const handleView = (tag: TagWithVendorCount) => {
    setSelectedTag(tag);
    setVendorsDrawerOpen(true);
  };

  const handleEdit = (tag: TagWithVendorCount) => {
    setSelectedTag(tag);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (tag: TagWithVendorCount) => {
    setSelectedTag(tag);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (name: string): Promise<boolean> => {
    const result = await createTag({ name });
    return !!result;
  };

  const handleEditSubmit = async (id: string, name: string): Promise<boolean> => {
    const result = await updateTag(id, { name });
    return !!result;
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!selectedTag) return false;
    const result = await deleteTag(selectedTag.id, selectedTag.name);
    return !!result;
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Delete Selected Tags',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected tags?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        const success = await deleteTags(selectedRowKeys as string[]);
        if (success) {
          setSelectedRowKeys([]);
        }
      },
    });
  };

  const handleCloseModals = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setVendorsDrawerOpen(false);
    setSelectedTag(null);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>
            <TagsOutlined className={styles.titleIcon} />
            Tag Management
          </h1>
          <p className={styles.pageSubtitle}>
            Organize vendors with tags and manage email preferences
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            type="primary"
            size="large"
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

      {/* Table Card */}
      <div className={styles.tableCard}>
        <TagSearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          onRefresh={refetch}
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
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Modals & Drawer */}
      <CreateTagModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={mutationLoading}
      />

      <EditTagModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
        onSubmit={handleEditSubmit}
        loading={mutationLoading}
      />

      <DeleteTagModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
        onConfirm={handleDeleteConfirm}
        loading={mutationLoading}
      />

      <TagVendorsDrawer
        open={vendorsDrawerOpen}
        onClose={() => {
          setVendorsDrawerOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
      />
    </div>
  );
}
