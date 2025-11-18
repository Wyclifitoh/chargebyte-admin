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
    ? mockStations.filter(station => station.partner === 'MallCorp Ltd') 
    : mockStations;

  // Set today's date (November 18th, 2025)
  const today = new Date(2025, 10, 18); // Month is 0-indexed, so 10 = November
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(today);
  todayEnd.setHours(14, 0, 0, 0); // Max time 2 PM as requested

  // Filter orders for today's data only
  const baseFilteredOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.rentalStartTime);
    
    // Check if order is from today and before 2 PM
    const isToday = orderDate >= todayStart && orderDate <= todayEnd;
    const matchesStation = selectedStation === 'all' || order.machineId === selectedStation;
    const matchesStatus = statusFilter === 'all' || order.rentalStatus === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isToday && matchesStation && matchesStatus && matchesSearch;
  });

  const filteredOrders = baseFilteredOrders;

  // Compute metrics for today
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalRentals = filteredOrders.length;
  const totalCustomers = new Set(filteredOrders.map(order => order.customerId)).size;
  const activeStations = visibleStations.filter(s => s.status === 'active').length;

  // Prepare data for charts - group by hour for today
  interface HourlyStats {
    [key: string]: { hour: string; rentals: number; revenue: number };
  }
  
  const hourlyStats: HourlyStats = {};
  filteredOrders.forEach(order => {
    const orderDate = new Date(order.rentalStartTime);
    const hourKey = `${orderDate.getHours().toString().padStart(2, '0')}:00`;
    
    if (!hourlyStats[hourKey]) {
      hourlyStats[hourKey] = { hour: hourKey, rentals: 0, revenue: 0 };
    }
    hourlyStats[hourKey].rentals += 1;
    hourlyStats[hourKey].revenue += order.totalAmount;
  });

  const chartData = Object.values(hourlyStats).sort(
    (a, b) => a.hour.localeCompare(b.hour)
  );

  // Calculate yesterday's data for comparison
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = new Date(yesterday);
  yesterdayStart.setHours(0, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(14, 0, 0, 0);

  const yesterdayOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.rentalStartTime);
    return orderDate >= yesterdayStart && orderDate <= yesterdayEnd;
  });

  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const revenueChange = yesterdayRevenue
    ? (((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
    : '0';

  const yesterdayRentals = yesterdayOrders.length;
  const rentalsChange = yesterdayRentals
    ? (((totalRentals - yesterdayRentals) / yesterdayRentals) * 100).toFixed(1)
    : '0';

  const yesterdayCustomers = new Set(yesterdayOrders.map(order => order.customerId)).size;
  const customersChange = yesterdayCustomers
    ? (((totalCustomers - yesterdayCustomers) / yesterdayCustomers) * 100).toFixed(1)
    : '0';

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
          <h1 className="text-3xl font-bold text-gray-900">Today's Rentals Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor today's powerbank rentals and station performance</p>
          <p className="text-sm text-primary-600 font-medium mt-1">
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
          </p>
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
            <CardTitle className="text-sm font-medium opacity-90">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs opacity-90">
              {Number(revenueChange) >= 0 ? '+' : ''}{revenueChange}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Rentals</CardTitle>
            <Battery className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRentals}</div>
            <p className="text-xs text-gray-600">
              {Number(rentalsChange) >= 0 ? '+' : ''}{rentalsChange}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-gray-600">
              {Number(customersChange) >= 0 ? '+' : ''}{customersChange}% from yesterday
            </p>
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
            <CardTitle>Today's Rental Activity</CardTitle>
            <CardDescription>Rental trends by hour (up to 2:00 PM)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'rentals' ? 'Rentals' : 'Revenue (Ksh)']}
                />
                <Line type="monotone" dataKey="rentals" stroke="#40E0D0" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Station (Today)</CardTitle>
            <CardDescription>Today's performance across stations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visibleStations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={(name) => name.split(' ')[0]} />
                <YAxis />
                <Tooltip formatter={(value) => [`Ksh.${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Orders</CardTitle>
              <CardDescription>All powerbank rental orders for {today.toLocaleDateString()}</CardDescription>
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
                  <TableCell>
                    {new Date(order.rentalStartTime).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </TableCell>
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