'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Users,
  MapPin,
  Battery,
  TrendingUp,
  Settings,
  Shield,
  Activity,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { mockAnalytics, mockStations, mockUsers, mockRentals } from '@/lib/mock-services/mock-data';

export default function SuperAdminDashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: `KES ${mockAnalytics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Rentals',
      value: mockAnalytics.totalRentals.toLocaleString(),
      change: '+8.2%',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Stations',
      value: `${mockAnalytics.activeStations}/${mockAnalytics.totalStations}`,
      change: '1 maintenance',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'System Users',
      value: mockUsers.length.toLocaleString(),
      change: 'All active',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Complete system control and monitoring</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Settings className="h-4 w-4 mr-2" />
          System Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              System Users
            </CardTitle>
            <CardDescription>All platform users across roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      user.role === 'super_admin'
                        ? 'border-purple-300 text-purple-700'
                        : user.role === 'admin'
                        ? 'border-blue-300 text-blue-700'
                        : user.role === 'staff'
                        ? 'border-green-300 text-green-700'
                        : user.role === 'location_partner'
                        ? 'border-orange-300 text-orange-700'
                        : user.role === 'ad_client'
                        ? 'border-pink-300 text-pink-700'
                        : 'border-cyan-300 text-cyan-700'
                    }
                  >
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Station Status
            </CardTitle>
            <CardDescription>Real-time station monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{station.name}</p>
                    <p className="text-sm text-gray-600">{station.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Battery className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {station.availablePowerbanks}/{station.capacity} available
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={station.status === 'active' ? 'default' : 'destructive'}
                    className={
                      station.status === 'active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : ''
                    }
                  >
                    {station.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system transactions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRentals.slice(0, 5).map((rental) => (
              <div
                key={rental.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      rental.status === 'active'
                        ? 'bg-blue-100'
                        : rental.status === 'completed'
                        ? 'bg-green-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    <Zap
                      className={`h-4 w-4 ${
                        rental.status === 'active'
                          ? 'text-blue-600'
                          : rental.status === 'completed'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{rental.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {rental.stationName} • KES {rental.deposit}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={rental.status === 'completed' ? 'default' : 'secondary'}
                  className={
                    rental.status === 'active'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }
                >
                  {rental.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-800">API Status</span>
                <Badge className="bg-green-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-800">Database</span>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-800">Uptime</span>
                <span className="text-sm font-medium text-purple-900">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-900">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    1 Station in Maintenance
                  </p>
                  <p className="text-xs text-orange-700">Sarit Centre</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Low Stock Alert</p>
                  <p className="text-xs text-orange-700">Sarit Centre - 3/15</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="ghost">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Settings className="h-4 w-4 mr-2" />
                System Config
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Activity className="h-4 w-4 mr-2" />
                View Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
