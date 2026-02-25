'use client';

import { RoleLayout } from '@/components/layout/role-layout';

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['super_admin', 'sponsor']}>
      {children}
    </RoleLayout>
  );
}
