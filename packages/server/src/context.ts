import { GraphQLError } from 'graphql';
import { getContainer } from './inversify/container';
import { TYPES } from './inversify/types';
import { IUserService } from './components/user/types';
import ErrorInfo from './components/common/error-info';

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

export const buildContext = async ({ req }: { req: any }) => {
  // Default JWT token for testing (demo@demo.com user)
  const defaultToken = 'eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ21zcy0tY3JtIiwiYXVkIjoiZ21zcy0tY3JtIiwiYXV0aF90aW1lIjoxNzY5NTE4OTk1LCJ1c2VyX2lkIjoiSlMxTGxya0t0SE0xOWVJMWVid29ZOWxPSTV3MSIsInN1YiI6IkpTMUxzcmtLdEhNMTllSTFlYndvWTlsT0k1dzEiLCJpYXQiOjE3Njk1MTg5OTUsImV4cCI6MTc2OTUyMjU5NSwiZW1haWwiOiJkZW1vQGRlbW8uY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbW9AZGVtby5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ';
  
  const token = (req.headers.authorization as string | undefined) || `Bearer ${defaultToken}`;
  
  let user: any = null;
  let decoded: any = null;

  // Extract and decode token
  const bearerToken = token.replace(/^Bearer\s+/i, '');
  decoded = safeJwtDecode(bearerToken);

  // DEVELOPMENT MODE: Skip strict validation, use default token if needed
  if (!decoded) {
    console.warn('⚠️ Invalid token, using default demo user');
    decoded = safeJwtDecode(defaultToken);
  }

  // Extract email from Firebase JWT token
  const email = decoded?.email || 'demo@demo.com';

  // Fetch user from database using email
  const container = getContainer();
  const userService = container.get<IUserService>(TYPES.IUserService);

  try {
    user = await userService.getUserByEmail(email);
    // If user doesn't exist, proceed without user (for testing purposes)
    if (!user) {
      console.warn(`⚠️ User not found for email: ${email}`);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    // Continue without user for testing
  }

  return { user, decoded };
};

export default buildContext;
