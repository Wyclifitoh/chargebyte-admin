'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockStations, mockOrders, mockChartData } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Battery,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter,
  Eye
} from 'lucide-react';

export default function RentalsPage() {
  const { user, hasPermission } = useAuth();
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStationDetail, setShowStationDetail] = useState<string | null>(null);

  // Filter data based on user role
  const visibleStations = hasPermission(['location_partner']) && user?.role === 'location_partner'
    ? mockStations.filter(station => station.partner === 'MallCorp Ltd') // Mock: partner-specific data
    : mockStations;

  const filteredOrders = mockOrders.filter(order => {
    const matchesStation = selectedStation === 'all' || order.machineId === selectedStation;
    const matchesStatus = statusFilter === 'all' || order.rentalStatus === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStation && matchesStatus && matchesSearch;
  });

  const totalRevenue = visibleStations.reduce((sum, station) => sum + station.revenue, 0);
  const totalRentals = visibleStations.reduce((sum, station) => sum + station.rentals, 0);
  const totalCustomers = visibleStations.reduce((sum, station) => sum + station.customers, 0);
  const activeStations = visibleStations.filter(s => s.status === 'active').length;

  const formatCurrency = (amount: number) => `Ksh.${amount.toFixed(2)}`;
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rentals Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor powerbank rentals and station performance</p>
        </div>
        {hasPermission(['super_admin', 'staff']) && (
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Battery className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs opacity-90">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Battery className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRentals}</div>
            <p className="text-xs text-gray-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-gray-600">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStations}</div>
            <p className="text-xs text-gray-600">of {visibleStations.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Rentals Trend</CardTitle>
            <CardDescription>Rental activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData.dailyRentals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'rentals' ? 'Rentals' : 'Revenue ($)']}
                />
                <Line type="monotone" dataKey="rentals" stroke="#40E0D0" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Station</CardTitle>
            <CardDescription>Performance comparison across stations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visibleStations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={(name) => name.split(' ')[0]} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stations Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Station Overview</CardTitle>
          <CardDescription>Monitor all charging stations and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rentals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.partner}</TableCell>
                  <TableCell>{station.region}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={station.status === 'active' ? 'default' : 'secondary'}
                      className={station.status === 'active' ? 'bg-emerald-100 text-emerald-700' : ''}
                    >
                      {station.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{station.availableSlots}/{station.totalSlots}</TableCell>
                  <TableCell>{formatCurrency(station.revenue)}</TableCell>
                  <TableCell>{station.rentals}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStationDetail(station.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track all powerbank rental orders</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  {visibleStations.map(station => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.machineId}</TableCell>
                  <TableCell>{formatCurrency(order.depositAmount)}</TableCell>
                  <TableCell>{order.rentalStartTime.toLocaleString()}</TableCell>
                  <TableCell>
                    {order.totalRentalTime ? formatDuration(order.totalRentalTime) : 'Ongoing'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={order.rentalStatus === 'completed' ? 'default' : 'secondary'}
                      className={
                        order.rentalStatus === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.rentalStatus === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : ''
                      }
                    >
                      {order.rentalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.totalAmount ? formatCurrency(order.totalAmount) : 'Pending'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}