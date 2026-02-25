'use client';

import { RoleLayout } from '@/components/layout/role-layout';

export default function AdvertisingPartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={['super_admin', 'ad_client']}>
      {children}
    </RoleLayout>
  );
}
