'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockStations } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users,
  Building2,
  Battery,
  Activity,
  AlertTriangle,
  TrendingUp,
  Banknote,
  Eye,
  Settings,
  Plus,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { getOrders, getOrderStats, getAllCustomerAnalytics, getDashboardData } from '@/lib/api/order';

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

interface DashboardData {
  total_customers?: { overall: number; last30Days: number };
  repeat_customers?: { overall: number; last30Days: number };
  women_percentage?: { overall: number; last30Days: number };
  new_customers_30d?: { overall: number | null; last30Days: number };
}

export default function AdminDashboardPage() {
  const { hasPermission } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  if (!hasPermission(['super_admin', 'staff'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  // Fetch all data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [ordersResponse, statsResponse, dashboardResponse] = await Promise.all([
        getOrders({ date: 'today', limit: 1000 }),
        getOrderStats({ date: 'today' }),
        getDashboardData()
      ]);

      setOrders(ordersResponse.data);
      setStats(statsResponse.data);
      setDashboardData(dashboardResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const today = new Date();
  
  // Compute metrics from API data
  const totalStations = mockStations.length;
  const activeStations = mockStations.filter(s => s.status === 'active').length;

  const totalUsers = 1250; 
  const activeUsers = 1180; 
  const recentLogs = []; 
  const warningLogs = 3; 

  const todaysRevenue = stats?.totalRevenue || 0;
  const todaysRentals = stats?.totalOrders || 0;
  const todaysCompleted = stats?.completedOrders || 0;
  const ongoingRentals = stats?.ongoingOrders || 0;

  const systemHealthData = [
    { name: 'CPU Usage', value: 42, status: 'good' },
    { name: 'Memory Usage', value: 65, status: 'warning' },
    { name: 'Disk Usage', value: 29, status: 'good' },
    { name: 'Network', value: 83, status: 'good' }
  ];

  // Prepare activity data for charts
  const activityBuckets = [
    { time: '06:00', users: 0, rentals: 0 },
    { time: '08:00', users: 0, rentals: 0 },
    { time: '10:00', users: 0, rentals: 0 },
    { time: '12:00', users: 0, rentals: 0 },
    { time: '14:00', users: 0, rentals: 0 }
  ];

  orders.forEach(order => {
    const hour = new Date(order.rentalStartTime).getHours();
    let bucketIndex = 0;
    
    if (hour >= 6 && hour < 8) bucketIndex = 0;
    else if (hour >= 8 && hour < 10) bucketIndex = 1;
    else if (hour >= 10 && hour < 12) bucketIndex = 2;
    else if (hour >= 12 && hour < 14) bucketIndex = 3;
    else if (hour >= 14) bucketIndex = 4;
    
    if (activityBuckets[bucketIndex]) {
      activityBuckets[bucketIndex].rentals += 1;
      activityBuckets[bucketIndex].users += 1;
    }
  });

  // Calculate comparison data (you can fetch yesterday's data from API)
  const yesterdayRevenue = todaysRevenue * 0.85; // Mock comparison
  const revenueChange = yesterdayRevenue
    ? (((todaysRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
    : '0';

  const yesterdayRentals = Math.floor(todaysRentals * 0.9); // Mock comparison
  const rentalsChange = yesterdayRentals
    ? (((todaysRentals - yesterdayRentals) / yesterdayRentals) * 100).toFixed(1)
    : '0';

  // Station performance for today
  const stationPerformance = mockStations.map(station => {
    const stationOrders = orders.filter(order => order.machineId === station.id);
    const stationRevenue = stationOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      ...station,
      todaysRevenue: stationRevenue,
      todaysRentals: stationOrders.length
    };
  });

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-emerald-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBg = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time system overview and management</p>
          <div className="flex items-center mt-2 text-sm text-primary-600 font-medium">
            <Calendar className="h-4 w-4 mr-2" />
            {today.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} 
            <span className="ml-2 flex items-center">
              <RefreshCw 
                className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} 
              />
              Live Data
            </span>
          </div>
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
          <Link href="/dashboard/admin/stations">
            <Button variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Manage Stations
            </Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Today's Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Today's Revenue</CardTitle>
            <Banknote className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh.{todaysRevenue.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">{todaysRentals}</div>
            <p className="text-xs text-gray-600">
              {ongoingRentals} ongoing • {Number(rentalsChange) >= 0 ? '+' : ''}{rentalsChange}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStations}/{totalStations}</div>
            <p className="text-xs text-gray-600">stations operational today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningLogs}</div>
            <p className="text-xs text-gray-600">warnings today</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health and Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealthData.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getHealthBg(metric.status)}`}></div>
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getHealthBg(metric.status)}`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getHealthColor(metric.status)}`}>
                    {metric.value}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
            <CardDescription>Rental patterns throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityBuckets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rentals" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Rentals"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/stations">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Station
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Create User Account
              </Button>
            </Link>
            <Link href="/dashboard/advertisements">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                Launch Ad Campaign
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </Link>
            <Link href="/dashboard/admin/logs">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                View Today's Logs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest system events and alerts from today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* You can replace this with real log data from API */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">System Startup</p>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      info
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">Powerbank rental system started for daily operations</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {today.toLocaleString()} • System
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full mt-2 bg-yellow-500"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">High Usage Alert</p>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                      warning
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">Station ST032 reached 80% capacity utilization</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {today.toLocaleString()} • System
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/admin/logs">
                <Button variant="outline" className="w-full">
                  View All Today's Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Station Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Station Performance</CardTitle>
          <CardDescription>Revenue and rental activity across all stations today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stationPerformance.map((station) => (
              <div key={station.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{station.name}</h4>
                  <Badge 
                    variant={station.status === 'active' ? 'default' : 'secondary'}
                    className={station.status === 'active' ? 'bg-emerald-100 text-emerald-700' : ''}
                  >
                    {station.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Region: {station.region}</p>
                  <p>Today's Revenue: Ksh.{station.todaysRevenue}</p>
                  <p>Today's Rentals: {station.todaysRentals}</p>
                  <p>Available: {station.availableSlots}/{station.totalSlots} slots</p>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Link href={`/dashboard/admin/stations`}>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    View Today's Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}