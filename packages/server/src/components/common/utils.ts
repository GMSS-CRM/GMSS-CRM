/**
 * Permission checking utility
 * Checks if the current user has a specific permission
 * Uses the global GraphQL context to access user permissions
 */

declare global {
  var graphqlContext: any;
}

export function hasPermission(permission: string): boolean {
  if (!global.graphqlContext) {
    console.warn('⚠️ GraphQL context not available');
    return false;
  }

  const { permissions = [] } = global.graphqlContext;

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
  if (!global.graphqlContext) {
    return null;
  }

  return global.graphqlContext.user;
}

export function getCurrentEmail() {
  if (!global.graphqlContext) {
    return null;
  }

  return global.graphqlContext.email;
}

export function getPermissions(): string[] {
  if (!global.graphqlContext) {
    return [];
  }

  return global.graphqlContext.permissions || [];
}
