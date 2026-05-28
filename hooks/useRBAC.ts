"use client";

import { useAuth, UserRole } from '@/contexts/AuthContext';

/**
 * Role-Based Access Control hook for Good Energy admin panel.
 * 
 * Role Hierarchy:
 * ┌──────────────┐
 * │ SUPER_ADMIN  │ ← Full access (platform owner)
 * ├──────────────┤
 * │ PARTNER      │ ← Full access (business owners - same privileges as SUPER_ADMIN)
 * ├──────────────┤
 * │ INVESTOR     │ ← Investor dashboard only (no admin panel)
 * ├──────────────┤
 * │ USER         │ ← Public user (no authenticated access)
 * └──────────────┘
 */
export function useRBAC() {
  const { user, loading } = useAuth();

  const role: UserRole = user?.role || 'USER';

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isPartner = role === 'PARTNER';
  const isInvestor = role === 'INVESTOR';

  // Users who can access the /admin panel
  const isAdminAreaUser = isSuperAdmin || isPartner;

  // Users who can access the investor dashboard
  const isDashboardUser = isSuperAdmin || isPartner || isInvestor;

  /**
   * Check if the current user has a specific permission.
   * SUPER_ADMIN has wildcard (*) access.
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  /**
   * Check if the user can access a specific resource by ownership.
   * SUPER_ADMIN can access any resource.
   * PARTNER can access resources assigned to them.
   * INVESTOR can only access their own resources.
   */
  const canAccessResource = (ownerId?: string, assignedTo?: string): boolean => {
    if (isSuperAdmin) return true;
    if (!user?.id) return false;

    if (isPartner) {
      return user.id === ownerId || user.id === assignedTo;
    }

    if (isInvestor) {
      return user.id === ownerId;
    }

    return false;
  };

  /**
   * Check if user can perform a specific action on a module.
   * Example: canAction('investors', 'write') checks for 'investors:write' permission.
   */
  const canAction = (module: string, action: 'read' | 'write' | 'delete'): boolean => {
    return hasPermission(`${module}:${action}`);
  };

  return {
    user,
    role,
    loading,
    isSuperAdmin,
    isPartner,
    isInvestor,
    isAdminAreaUser,
    isDashboardUser,
    hasPermission,
    canAccessResource,
    canAction,
  };
}
