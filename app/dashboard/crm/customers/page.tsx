'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Mail,
  Phone,
  Building,
  Download,
  Filter,
  Eye,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
    name: 'Safaricom PLC',
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
  {
    id: 'C004',
    name: 'Coca-Cola Kenya',
    contact: 'Ann Wambui',
    email: 'ann@cocacola.co.ke',
    phone: '+254 733 456 789',
    type: 'Sponsor',
    status: 'active',
    joinDate: '2024-01-20',
    monthlyRevenue: 300000,
    stations: 5,
    totalRevenue: 900000,
  },
  {
    id: 'C005',
    name: 'Java House',
    contact: 'Michael Kimani',
    email: 'michael@javahouse.co.ke',
    phone: '+254 744 567 890',
    type: 'Location Partner',
    status: 'inactive',
    joinDate: '2023-11-15',
    monthlyRevenue: 0,
    stations: 1,
    totalRevenue: 120000,
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [customers] = useState(mockCustomers);

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

  const handleExport = () => {
    toast.success('Customer data exported successfully!');
  };

  const handleViewProfile = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    toast.success(`Viewing profile for ${customer?.name}`);
  };

  const handleViewRevenue = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    toast.success(`Revenue report for ${customer?.name} generated`);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    monthlyRevenue: customers.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">
                  KES {(stats.monthlyRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  KES {(stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Customers</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Location Partner">Location Partner</SelectItem>
                  <SelectItem value="Sponsor">Sponsor</SelectItem>
                  <SelectItem value="Advertiser">Advertiser</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stations</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-900">{customer.contact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{customer.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{customer.stations}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-emerald-600">
                        KES {(customer.monthlyRevenue / 1000).toFixed(0)}K
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-purple-600">
                        KES {(customer.totalRevenue / 1000).toFixed(0)}K
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProfile(customer.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewRevenue(customer.id)}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Revenue
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No customers found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
