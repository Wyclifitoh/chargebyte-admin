'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

const mockCustomers = [
  {
    id: 'C001',
    name: 'Westgate Shopping Mall',
    contact: 'James Mwangi',
    email: 'james@westgate.co.ke',
    phone: '+254 720 123 456',
    type: 'Location Partner',
    status: 'active',
    joinDate: '2024-01-15',
    monthlyRevenue: 150000,
    stations: 3,
    totalRevenue: 600000,
  },
  {
    id: 'C002',
    name: 'The Hub Karen',
    contact: 'David Omondi',
    email: 'david@thehub.co.ke',
    phone: '+254 722 345 678',
    type: 'Location Partner',
    status: 'active',
    joinDate: '2024-02-01',
    monthlyRevenue: 85000,
    stations: 2,
    totalRevenue: 170000,
  },
  {
    id: 'C003',
    name: 'SafaricomPLC',
    contact: 'Sarah Njeri',
    email: 'sarah.njeri@safaricom.co.ke',
    phone: '+254 711 234 567',
    type: 'Sponsor',
    status: 'active',
    joinDate: '2023-12-10',
    monthlyRevenue: 500000,
    stations: 10,
    totalRevenue: 1500000,
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const stats = {
    total: mockCustomers.length,
    active: mockCustomers.filter(c => c.status === 'active').length,
    monthlyRevenue: mockCustomers.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalRevenue, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">
              KES {(stats.monthlyRevenue / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              KES {(stats.totalRevenue / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-600">{customer.contact}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{customer.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Since {new Date(customer.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-center px-4 py-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-gray-600">Monthly Revenue</p>
                          <p className="text-lg font-bold text-emerald-600">
                            KES {(customer.monthlyRevenue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600">Total Revenue</p>
                          <p className="text-lg font-bold text-blue-600">
                            KES {(customer.totalRevenue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                          <p className="text-xs text-gray-600">Stations</p>
                          <p className="text-lg font-bold text-purple-600">{customer.stations}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          View Stations
                        </Button>
                        <Button variant="outline" size="sm">
                          Revenue Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
