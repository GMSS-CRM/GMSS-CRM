import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  user: any;
  decoded: any;
  permissions: string[];
  email: string;
}

/**
 * AsyncLocalStorage instance for request-scoped context.
 * Each incoming GraphQL request stores its context here,
 * making it safely accessible from any service or utility
 * without risking cross-request data leaks.
 */
export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Get the current request context from AsyncLocalStorage.
 * Returns undefined if called outside a request scope.
 */
export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}
