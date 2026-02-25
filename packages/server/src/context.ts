import { getContainer } from './inversify/container';
import { TYPES } from './inversify/types';
import { IUserService } from './components/user/types';
import { IRolePermissionService } from './components/role-permission/types';

/**
 * Safely decode a Firebase JWT token without verification
 * (verification is done by Firebase client-side)
 */
function safeJwtDecode(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length < 3) return null;
    
    const payload = parts[1];
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// Default JWT token for testing (demo@demo.com user) — only used in development
const DEFAULT_DEV_TOKEN = 'eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ21zcy0tY3JtIiwiYXVkIjoiZ21zcy0tY3JtIiwiYXV0aF90aW1lIjoxNzY5NTE4OTk1LCJ1c2VyX2lkIjoiSlMxTGxya0t0SE0xOWVJMWVid29ZOWxPSTV3MSIsInN1YiI6IkpTMUxzcmtLdEhNMTllSTFlYndvWTlsT0k1dzEiLCJpYXQiOjE3Njk1MTg5OTUsImV4cCI6MTc2OTUyMjU5NSwiZW1haWwiOiJkZW1vQGRlbW8uY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbW9AZGVtby5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ';

export const buildContext = async ({ req }: { req: any }) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const authHeader = req.headers.authorization as string | undefined;
  const token = isProduction
    ? authHeader ?? ''
    : authHeader ?? `Bearer ${DEFAULT_DEV_TOKEN}`;
  
  let user: any = null;
  let decoded: any = null;
  let permissions: string[] = [];

  // Extract and decode token
  const bearerToken = token.replace(/^Bearer\s+/i, '');
  decoded = safeJwtDecode(bearerToken);

  if (!decoded && !isProduction) {
    console.warn('⚠️ Invalid token, falling back to default demo user (dev mode only)');
    decoded = safeJwtDecode(DEFAULT_DEV_TOKEN);
  }

  if (!decoded && isProduction) {
    console.error('❌ Invalid or missing auth token in production');
    return { user: null, decoded: null, permissions: [], email: '' };
  }

  // Extract email from Firebase JWT token
  const email = decoded?.email || (isProduction ? '' : 'demo@demo.com');

  // Fetch user and their permissions from database
  const container = getContainer();
  const userService = container.get<IUserService>(TYPES.IUserService);
  const rolePermissionService = container.get<IRolePermissionService>(TYPES.IRolePermissionService);

  try {
    user = await userService.getUserByEmail(email);
    
    // If user exists, fetch their permissions based on their roleId
    if (user && user.roleId) {
      try {
        permissions = await rolePermissionService.getPermissionsByRoleId(user.roleId);
      } catch (permError) {
        console.warn(`⚠️ Could not fetch permissions for user: ${email}`, permError);
        permissions = [];
      }
    } else {
      console.warn(`⚠️ User has no roleId for email: ${email}`);
    }
  } catch (error) {
    console.error('User Not Authorized:', error);
    if (isProduction) {
      return { user: null, decoded: null, permissions: [], email: '' };
    }
    // Continue without user in development for testing
  }

  return { user, decoded, permissions, email };
};

export default buildContext;
