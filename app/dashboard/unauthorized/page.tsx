'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldAlert className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Logged in as: <span className="font-medium text-gray-900">{user?.name}</span>
            </p>
            <p className="text-sm text-gray-600">
              Role: <span className="font-medium text-gray-900">{user?.role}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              Go Back
            </Button>
            <Button onClick={logout} variant="destructive" className="flex-1">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
