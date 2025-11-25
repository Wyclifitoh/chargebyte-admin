'use client';

import { useState, useEffect } from 'react';
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
import { mockStations } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Battery,
  MapPin,
  Banknote,
  Users,
  TrendingUp,
  Search,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';
import { getOrders, getOrderStats, getFilterOptions } from '@/lib/api/order';

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  depositAmount: number;
  machineId: string;
  rentalStartTime: string;
  rentalEndTime: string | null;
  rentalStatus: 'ongoing' | 'completed' | 'cancelled';
  rentalSlotNo: number;
  returnedSlotNo: number | null;
  totalRentalTime: number;
  totalAmount: number;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  ongoingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export default function RentalsPage() {
  const { user, hasPermission } = useAuth();
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter data based on user role
  const visibleStations = hasPermission(['location_partner']) && user?.role === 'location_partner'
    ? mockStations.filter(station => station.partner === 'MallCorp Ltd') 
    : mockStations;

  const today = new Date();
  
  // Fetch orders data
  const fetchOrdersData = async () => {
    try {
      setRefreshing(true);
      const filters = {
        date: 'today',
        status: statusFilter === 'all' ? undefined : statusFilter,
        machineId: selectedStation === 'all' ? undefined : selectedStation,
        search: searchTerm || undefined,
        limit: 1000 
      };

      const [ordersResponse, statsResponse, optionsResponse] = await Promise.all([
        getOrders(filters),
        getOrderStats(filters),
        getFilterOptions()
      ]);

      setOrders(ordersResponse.data);
      setStats(statsResponse.data);
      setFilterOptions(optionsResponse.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [selectedStation, statusFilter, searchTerm]);

  // Compute metrics from API data
  const totalRevenue = stats?.totalRevenue || 0;
  const totalRentals = stats?.totalOrders || 0;
  const totalCustomers = stats?.uniqueCustomers || 0;
  const activeStations = visibleStations.filter(s => s.status === 'active').length;

  // Prepare data for charts - group by hour for today
  interface HourlyStats {
    [key: string]: { hour: string; rentals: number; revenue: number };
  }
  
  const hourlyStats: HourlyStats = {};
  orders.forEach(order => {
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

  // Calculate yesterday's data for comparison (you might want to fetch this from API)
  const yesterdayRevenue = totalRevenue * 0.85; // Mock comparison
  const revenueChange = yesterdayRevenue
    ? (((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
    : '0';

  const yesterdayRentals = Math.floor(totalRentals * 0.9); 
  const rentalsChange = yesterdayRentals
    ? (((totalRentals - yesterdayRentals) / yesterdayRentals) * 100).toFixed(1)
    : '0';

  const yesterdayCustomers = Math.floor(totalCustomers * 0.88);  
  const customersChange = yesterdayCustomers
    ? (((totalCustomers - yesterdayCustomers) / yesterdayCustomers) * 100).toFixed(1)
    : '0';
 
  const formatCurrency = (amount: number | string) => {
    // Convert to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Ksh.${numericAmount.toFixed(2)}`;
  };
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleRefresh = () => {
    fetchOrdersData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading orders data...</p>
        </div>
      </div>
    );
  }

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
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {hasPermission(['super_admin', 'staff']) && (
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Battery className="mr-2 h-4 w-4" />
              Add Station
            </Button>
          )}
        </div>
      </div>
        
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Today's Revenue</CardTitle>
            <Banknote className="h-4 w-4 opacity-90" />
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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Rental Activity</CardTitle>
            <CardDescription>Rental trends by hour</CardDescription>
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

        {/* <Card>
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
        </Card> */}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Orders</CardTitle>
              <CardDescription>All powerbank rental orders for {today.toLocaleDateString()}</CardDescription>
              <p className="text-sm text-gray-500 mt-1">
                Showing {orders.length} orders • Last updated: {new Date().toLocaleTimeString()}
              </p>
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
                  {filterOptions?.machines?.map((station: any) => (
                    <SelectItem key={station.value} value={station.value}>
                      {station.value}
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
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found for today</p>
            </div>
          ) : (
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
                {orders.map((order) => (
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
                            : order.rentalStatus === 'ongoing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}