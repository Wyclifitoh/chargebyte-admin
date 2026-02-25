'use client';

import { RoleLayout } from '@/components/layout/role-layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['super_admin', 'admin']}>
      {children}
    </RoleLayout>
  );
}
