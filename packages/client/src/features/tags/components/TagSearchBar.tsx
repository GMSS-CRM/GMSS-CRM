
import { Input, Button, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from '../styles/tags.module.css';

interface TagSearchBarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  loading?: boolean;
}

export default function TagSearchBar({
  searchText,
  onSearchChange,
  onRefresh,
  selectedCount,
  onBulkDelete,
  loading,
}: TagSearchBarProps) {
  return (
    <div className={styles.tableHeader}>
      <div className={styles.searchSection}>
        <Input
          placeholder="Search tags by name..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
          allowClear
        />
      </div>
      
      <div className={styles.tableActions}>
        {selectedCount > 0 && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onBulkDelete}
            className={styles.bulkDeleteBtn}
          >
            Delete ({selectedCount})
          </Button>
        )}
        <Tooltip title="Refresh">
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={onRefresh}
          />
        </Tooltip>
      </div>
    </div>
  );
}
