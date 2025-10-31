'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockStations, mockUsers, mockOrders, mockCampaigns, mockLogs } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users,
  Building2,
  Battery,
  Activity,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Eye,
  Settings,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { hasPermission } = useAuth();

  if (!hasPermission(['super_admin', 'staff'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  // Calculate admin metrics
  const totalStations = mockStations.length;
  const activeStations = mockStations.filter(s => s.status === 'active').length;
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const totalRevenue = mockStations.reduce((sum, station) => sum + station.revenue, 0);
  const totalRentals = mockStations.reduce((sum, station) => sum + station.rentals, 0);
  const recentLogs = mockLogs.slice(0, 5);
  const warningLogs = mockLogs.filter(log => log.severity === 'warning').length;

  // Mock system health data
  const systemHealthData = [
    { name: 'CPU Usage', value: 45, status: 'good' },
    { name: 'Memory Usage', value: 67, status: 'warning' },
    { name: 'Disk Usage', value: 23, status: 'good' },
    { name: 'Network', value: 89, status: 'good' }
  ];

  // Recent activity data for chart
  const activityData = [
    { time: '00:00', users: 12, rentals: 8 },
    { time: '04:00', users: 8, rentals: 5 },
    { time: '08:00', users: 45, rentals: 32 },
    { time: '12:00', users: 67, rentals: 48 },
    { time: '16:00', users: 89, rentals: 62 },
    { time: '20:00', users: 56, rentals: 41 }
  ];

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and management controls</p>
        </div>
        <div className="flex space-x-3">
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

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh.{totalRevenue.toLocaleString()}</div>
            <p className="text-xs opacity-90">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStations}/{totalStations}</div>
            <p className="text-xs text-gray-600">stations operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}/{totalUsers}</div>
            <p className="text-xs text-gray-600">active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningLogs}</div>
            <p className="text-xs text-gray-600">warnings pending</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health and Activity */}
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
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>User activity and rental patterns today</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#40E0D0" 
                  strokeWidth={2}
                  name="Active Users"
                />
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
                View System Logs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest system events and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.severity === 'warning' ? 'bg-yellow-500' : 
                    log.severity === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <Badge 
                        variant="outline" 
                        className={
                          log.severity === 'warning' ? 'border-yellow-500 text-yellow-700' :
                          log.severity === 'error' ? 'border-red-500 text-red-700' :
                          'border-blue-500 text-blue-700'
                        }
                      >
                        {log.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{log.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.timestamp.toLocaleString()} • {log.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/admin/logs">
                <Button variant="outline" className="w-full">
                  View All Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Station Status Overview</CardTitle>
          <CardDescription>Current status of all charging stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockStations.map((station) => (
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
                  <p>Available: {station.availableSlots}/{station.totalSlots} slots</p>
                  <p>Revenue: ${station.revenue.toFixed(2)}</p>
                  <p>Rentals: {station.rentals}</p>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Link href={`/dashboard/admin/stations`}>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    View Details
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