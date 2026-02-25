'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'location_partner' | 'ad_client' | 'sponsor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'superadmin@chargebyte.io',
    name: 'Super Admin',
    role: 'super_admin',
  },
  {
    id: '2',
    email: 'admin@chargebyte.io',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '3',
    email: 'staff@chargebyte.io',
    name: 'Staff Member',
    role: 'staff',
  },
  {
    id: '4',
    email: 'partner@chargebyte.io',
    name: 'Location Partner',
    role: 'location_partner',
  },
  {
    id: '5',
    email: 'advertiser@chargebyte.io',
    name: 'Advertising Partner',
    role: 'ad_client',
  },
  {
    id: '6',
    email: 'sponsor@chargebyte.io',
    name: 'Sponsor',
    role: 'sponsor',
  },
];

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  hasPermission: (permissions: UserRole[]) => boolean;
  demoLogin: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('chargebyte_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('chargebyte_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chargebyte_user');
    router.push('/login');
  };

  const hasPermission = (permissions: UserRole[]): boolean => {
    return user ? permissions.includes(user.role) : false;
  };

  const demoLogin = (email: string): boolean => {
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser) {
      login(demoUser);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}