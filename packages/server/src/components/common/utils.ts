/**
 * Permission checking utility
 * Checks if the current user has a specific permission
 * Uses request-scoped AsyncLocalStorage context
 */
import { getRequestContext } from './request-context';

export function hasPermission(permission: string): boolean {
  const ctx = getRequestContext();
  if (!ctx) {
    console.warn('⚠️ Request context not available');
    return false;
  }

  const { permissions = [] } = ctx;

  if (!Array.isArray(permissions)) {
    console.warn('⚠️ Permissions is not an array');
    return false;
  }

  return permissions.includes(permission);
}

export function requirePermission(permission: string): void {
  if (!hasPermission(permission)) {
    throw new Error(`User does not have permission: ${permission}`);
  }
}

export function getCurrentUser() {
  const ctx = getRequestContext();
  if (!ctx) {
    return null;
  }

  return ctx.user;
}

export function getCurrentEmail() {
  const ctx = getRequestContext();
  if (!ctx) {
    return '';
  }

  return ctx.email;
}

export function getPermissions(): string[] {
  const ctx = getRequestContext();
  if (!ctx) {
    return [];
  }

  return ctx.permissions || [];
}
