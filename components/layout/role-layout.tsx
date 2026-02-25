'use client';

import { useAuth, UserRole } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleLayoutProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleLayout({ children, allowedRoles, redirectTo = '/dashboard/unauthorized' }: RoleLayoutProps) {
  const { user, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!hasPermission(allowedRoles)) {
      router.push(redirectTo);
    }
  }, [user, hasPermission, allowedRoles, redirectTo, router]);

  if (!user || !hasPermission(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}
