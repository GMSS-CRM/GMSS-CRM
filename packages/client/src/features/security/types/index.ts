/**
 * Type definitions for Security module — re-exported from backend-generated types.
 */
export type { User, Role } from '@gmss/types';
export { Permission } from '@gmss/types';

/** Human-readable label + module grouping for each Permission enum value */
export const PERMISSION_LABELS: Record<string, { label: string; module: string }> = {
  READ_USER:        { label: 'Read Users',        module: 'Users' },
  CREATE_USER:      { label: 'Create Users',      module: 'Users' },
  UPDATE_USER:      { label: 'Update Users',      module: 'Users' },
  DELETE_USER:      { label: 'Delete Users',      module: 'Users' },
  READ_ROLE:        { label: 'Read Roles',        module: 'Roles' },
  CREATE_ROLE:      { label: 'Create Roles',      module: 'Roles' },
  UPDATE_ROLE:      { label: 'Update Roles',      module: 'Roles' },
  DELETE_ROLE:      { label: 'Delete Roles',      module: 'Roles' },
  READ_APP_SETTING:   { label: 'Read Settings',   module: 'App Settings' },
  UPDATE_APP_SETTING: { label: 'Update Settings', module: 'App Settings' },
};

/** All Permission enum values — used as the full pool in the permissions dual-panel UI */
export const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS) as string[];
