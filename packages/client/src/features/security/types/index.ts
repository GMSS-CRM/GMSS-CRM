/**
 * Type definitions for Security module
 */

export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  email: string;
  role?: string;
  restrictions?: string[];
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdBy?: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  userCount?: number; // For UI purposes - number of users with this role
  isSystemRole?: boolean; // For UI purposes - prevent deletion of system roles
}

export interface Restriction {
  id: string;
  name: string;
  type: 'EquipmentTag' | 'Location' | 'Department';
}
