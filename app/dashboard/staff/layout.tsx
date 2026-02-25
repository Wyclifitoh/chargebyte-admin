'use client';

import { RoleLayout } from '@/components/layout/role-layout';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['super_admin', 'admin', 'staff']}>
      {children}
    </RoleLayout>
  );
}
