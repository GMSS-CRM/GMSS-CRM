/**
 * AppTable — Shared Table Component
 *
 * Drop-in replacement for antd `<Table>` with consistent, dark-mode-aware styling
 * matching the vendor table design (bg-panel rows, bg-muted headers, bg-hover on hover).
 *
 * @example
 * <AppTable columns={columns} dataSource={data} rowKey="id" />
 */
import { Table } from 'antd';
import type { TableProps } from 'antd';
import styles from './styles.module.css';

// Re-export ColumnsType for convenience
export type { ColumnsType } from 'antd/es/table';

type AppTableProps<T extends object> = TableProps<T>;

export default function AppTable<T extends object>({
  className,
  ...props
}: AppTableProps<T>) {
  // Apply the shared app-table style class alongside any caller-provided className.
  // className is placed on ant-table-wrapper so all :global(.ant-table-*) selectors work.
  const combined = [styles.table, className].filter(Boolean).join(' ');
  return <Table<T> className={combined} {...props} />;
}
