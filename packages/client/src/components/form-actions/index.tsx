import type { ReactNode } from 'react';
import { DeleteFilled, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import Button from '../button';
import styles from './styles.module.css';

export interface FormActionsBarProps {
  /** Primary "OK / Save" action */
  onOk: () => void;
  okLabel?: string;
  okIcon?: ReactNode;
  okLoading?: boolean;
  okDisabled?: boolean;

  /** Cancel / Back action */
  onCancel: () => void;
  cancelLabel?: string;
  cancelIcon?: ReactNode;

  /** Optional delete action — renders on the left when provided */
  onDelete?: () => void;
  deleteLabel?: string;
  deleteLoading?: boolean;

  /** Optional extra workflow button rendered between Cancel and OK (e.g. "Send to MD") */
  extraAction?: ReactNode;
}

/**
 * Shared sticky footer action bar used in detail / edit forms.
 *
 * Layout:
 *   [ Delete ]                  [ Cancel ]  [ extraAction? ]  [ OK ]
 */
export default function FormActionsBar({
  onOk,
  okLabel = 'Save',
  okIcon = <SaveOutlined />,
  okLoading = false,
  okDisabled = false,
  onCancel,
  cancelLabel = 'Cancel',
  cancelIcon = <CloseOutlined />,
  onDelete,
  deleteLabel = 'Delete',
  deleteLoading = false,
  extraAction,
}: FormActionsBarProps) {
  return (
    <div className={styles.footer}>
      {/* Left — destructive action */}
      <div className={styles.left}>
        {onDelete && (
          <Button
            variant="danger"
            onClick={onDelete}
            icon={<DeleteFilled />}
            size="large"
            loading={deleteLoading}
          >
            {deleteLabel}
          </Button>
        )}
      </div>

      {/* Right — navigation + primary actions */}
      <div className={styles.right}>
        <Button
          variant="secondary"
          onClick={onCancel}
          icon={cancelIcon}
          size="large"
        >
          {cancelLabel}
        </Button>

        {extraAction}

        <Button
          variant="primary"
          onClick={onOk}
          icon={okIcon}
          disabled={okDisabled}
          loading={okLoading}
          size="large"
        >
          {okLabel}
        </Button>
      </div>
    </div>
  );
}
