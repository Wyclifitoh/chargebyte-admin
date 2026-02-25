'use client';

import { RoleLayout } from '@/components/layout/role-layout';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['super_admin']}>
      {children}
    </RoleLayout>
  );
}
