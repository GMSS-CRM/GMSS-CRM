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
}

export interface Restriction {
  id: string;
  name: string;
  type: 'EquipmentTag' | 'Location' | 'Department';
}

export type SecurityMenuItem = 'users' | 'roles' | 'permissions';
