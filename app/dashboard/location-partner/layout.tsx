'use client';

import { RoleLayout } from '@/components/layout/role-layout';

export default function LocationPartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['super_admin', 'location_partner']}>
      {children}
    </RoleLayout>
  );
}
