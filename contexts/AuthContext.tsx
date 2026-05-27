"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';

// ===========================
// TYPES
// ===========================

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: string[];
  imageUrl?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'PARTNER' | 'INVESTOR' | 'USER';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ===========================
// CONTEXT
// ===========================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ===========================
// ROLE MAPPING
// ===========================

/**
 * Good Energy role hierarchy:
 * - SUPER_ADMIN: Full access (Sebastian / platform owner)
 * - PARTNER: Brand partners with limited admin access (investors management, reports)
 * - INVESTOR: Investor dashboard access only
 * - USER: Public user, no admin access
 */
function normalizeRole(rawRole: string | undefined): UserRole {
  if (!rawRole) return 'USER';
  const upper = rawRole.toUpperCase();

  // Legacy compatibility mappings
  if (upper === 'ADMIN') return 'SUPER_ADMIN';
  if (upper === 'COMMERCIAL') return 'PARTNER'; // Apex compat

  // Valid Good Energy roles
  if (['SUPER_ADMIN', 'PARTNER', 'INVESTOR'].includes(upper)) {
    return upper as UserRole;
  }

  return 'USER';
}

function getPermissions(role: UserRole): string[] {
  switch (role) {
    case 'SUPER_ADMIN':
      return ['*'];
    case 'PARTNER':
      return [
        'admin:access',
        'investors:read',
        'investors:write',
        'investments:read',
        'investments:write',
        'earnings:read',
        'earnings:write',
        'plants:read',
        'blog:read',
        'blog:write',
        'analytics:read',
      ];
    case 'INVESTOR':
      return [
        'dashboard:access',
        'investments:read:own',
        'earnings:read:own',
        'profile:read:own',
        'profile:write:own',
      ];
    default:
      return [];
  }
}

// ===========================
// PROVIDER
// ===========================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const rawRole = clerkUser?.publicMetadata?.role as string | undefined;
  const normalizedRole = normalizeRole(rawRole);

  const validAdminRoles: UserRole[] = ['SUPER_ADMIN', 'PARTNER', 'INVESTOR'];
  const isValidRole = validAdminRoles.includes(normalizedRole);

  const user: AdminUser | null = isSignedIn && clerkUser && isValidRole ? {
    id: clerkUser.id,
    username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    role: normalizedRole,
    permissions: getPermissions(normalizedRole),
    imageUrl: clerkUser.imageUrl,
  } : null;

  // Auth redirect logic
  useEffect(() => {
    if (isLoaded && pathname?.startsWith('/admin')) {
      if (!isSignedIn) {
        router.push('/sign-in?redirect_url=' + encodeURIComponent(pathname));
      }
      // If user is signed in but has no admin role, the admin layout
      // will handle showing "Access Denied" — no redirect loop.
    }
  }, [isLoaded, isSignedIn, normalizedRole, pathname, router]);

  const value: AuthContextType = {
    user,
    loading: !isLoaded,
    login: async () => false, // Legacy fallback — auth is handled by Clerk
    logout: async () => {
      await signOut();
      router.push('/sign-in');
    },
    checkAuth: async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
