'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockStations, mockOrders, mockCampaigns, mockChartData } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp,
  DollarSign,
  Users,
  Battery,
  Eye,
  MousePointer,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const COLORS = ['#40E0D0', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  if (!hasPermission(['super_admin', 'staff'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  // Calculate analytics data
  const totalRevenue = mockStations.reduce((sum, station) => sum + station.revenue, 0);
  const totalRentals = mockStations.reduce((sum, station) => sum + station.rentals, 0);
  const totalCustomers = mockStations.reduce((sum, station) => sum + station.customers, 0);
  const totalImpressions = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalImpressions, 0);
  const totalInteractions = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalInteractions, 0);

  // Station performance data for pie chart
  const stationPerformanceData = mockStations.map(station => ({
    name: station.name.split(' ')[0],
    value: station.revenue,
    rentals: station.rentals
  }));

  // Regional performance data
  const regionalData = mockStations.reduce((acc, station) => {
    const existing = acc.find(item => item.region === station.region);
    if (existing) {
      existing.revenue += station.revenue;
      existing.rentals += station.rentals;
      existing.customers += station.customers;
    } else {
      acc.push({
        region: station.region,
        revenue: station.revenue,
        rentals: station.rentals,
        customers: station.customers
      });
    }
    return acc;
  }, [] as any[]);

  // Monthly trend data (mock)
  const monthlyTrendData = [
    { month: 'Jan', revenue: 12400, rentals: 890, customers: 456 },
    { month: 'Feb', revenue: 15600, rentals: 1120, customers: 578 },
    { month: 'Mar', revenue: 18900, rentals: 1350, customers: 689 },
    { month: 'Apr', revenue: 22100, rentals: 1580, customers: 798 },
    { month: 'May', revenue: 19800, rentals: 1420, customers: 723 },
    { month: 'Jun', revenue: 25300, rentals: 1810, customers: 912 }
  ];

  // Campaign performance comparison
  const campaignComparisonData = mockCampaigns.map(campaign => ({
    name: campaign.name,
    impressions: campaign.totalImpressions,
    interactions: campaign.totalInteractions,
    ctr: ((campaign.totalInteractions / campaign.totalImpressions) * 100).toFixed(2)
  }));

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive business intelligence and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            <div className="text-2xl font-bold">{totalRentals.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Impressions</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
            <p className="text-xs text-gray-600">+22.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Interactions</CardTitle>
            <MousePointer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalInteractions)}</div>
            <p className="text-xs text-gray-600">+18.7% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Rental Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#40E0D0" 
                  fill="#40E0D0" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rental Activity</CardTitle>
            <CardDescription>Monthly rental volume and customer growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rentals" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Rentals"
                />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Station Performance and Regional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Station Revenue Distribution</CardTitle>
            <CardDescription>Revenue contribution by station</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stationPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stationPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Performance metrics by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#40E0D0" name="Revenue ($)" />
                <Bar dataKey="rentals" fill="#10b981" name="Rentals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Campaign Performance</CardTitle>
          <CardDescription>Impressions and interactions across all campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={campaignComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="impressions" 
                fill="#3b82f6" 
                name="Impressions"
              />
              <Bar 
                yAxisId="right"
                dataKey="interactions" 
                fill="#10b981" 
                name="Interactions"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Station Performance Summary</CardTitle>
          <CardDescription>Detailed performance metrics for all stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Station</th>
                  <th className="text-left p-2">Region</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Rentals</th>
                  <th className="text-left p-2">Customers</th>
                  <th className="text-left p-2">Avg Revenue/Rental</th>
                  <th className="text-left p-2">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {mockStations.map((station) => (
                  <tr key={station.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{station.name}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="capitalize">
                        {station.region}
                      </Badge>
                    </td>
                    <td className="p-2">{formatCurrency(station.revenue)}</td>
                    <td className="p-2">{station.rentals}</td>
                    <td className="p-2">{station.customers}</td>
                    <td className="p-2">{formatCurrency(station.revenue / station.rentals)}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ 
                              width: `${((station.totalSlots - station.availableSlots) / station.totalSlots) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(((station.totalSlots - station.availableSlots) / station.totalSlots) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}