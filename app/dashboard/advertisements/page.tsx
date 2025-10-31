'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCampaigns, mockChartData } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Megaphone,
  Eye,
  Users,
  MousePointer,
  TrendingUp,
  Calendar,
  BarChart3,
  QrCode
} from 'lucide-react';

export default function AdvertisementsPage() {
  const { hasPermission } = useAuth();
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const selectedCampaignData = mockCampaigns.find(c => c.id === selectedCampaign);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedCampaign && selectedCampaignData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedCampaign(null)}
              className="mb-4"
            >
              ← Back to Campaigns
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedCampaignData.name}</h1>
            <p className="text-gray-600 mt-1">Campaign performance and analytics</p>
          </div>
          <Badge className={getStatusColor(selectedCampaignData.status)}>
            {selectedCampaignData.status}
          </Badge>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(selectedCampaignData.totalImpressions)}</div>
              <p className="text-xs text-gray-600">+5.2% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
              <MousePointer className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(selectedCampaignData.totalInteractions)}</div>
              <p className="text-xs text-gray-600">+12.3% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Station</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(selectedCampaignData.avgImpressionsPerStation)}</div>
              <p className="text-xs text-gray-600">impressions per station</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Interactions</CardTitle>
              <QrCode className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedCampaignData.qrCodeInteractions}</div>
              <p className="text-xs text-gray-600">direct QR code scans</p>
            </CardContent>
          </Card>
        </div>

        {/* Time Period Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(selectedCampaignData.todayImpressions)}</div>
              <p className="text-sm opacity-90">impressions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(selectedCampaignData.weeklyImpressions)}</div>
              <p className="text-sm opacity-90">impressions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(selectedCampaignData.monthlyImpressions)}</div>
              <p className="text-sm opacity-90">impressions</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance Over Time</CardTitle>
            <CardDescription>Daily impressions and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockChartData.campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Impressions"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="interactions" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Interactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Station Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Station Performance</CardTitle>
            <CardDescription>Performance breakdown by station location</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station ID</TableHead>
                  <TableHead>Station Name</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Interactions</TableHead>
                  <TableHead>CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCampaignData.stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell className="font-medium">{station.id}</TableCell>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>{station.county}</TableCell>
                    <TableCell>{formatNumber(station.impressions)}</TableCell>
                    <TableCell>{station.interactions}</TableCell>
                    <TableCell>
                      {((station.interactions / station.impressions) * 100).toFixed(2)}%
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisement Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage campaigns and track advertising performance</p>
        </div>
        {hasPermission(['super_admin', 'staff']) && (
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Megaphone className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCampaigns.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs opacity-90">campaigns running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(mockCampaigns.reduce((sum, c) => sum + c.totalImpressions, 0))}
            </div>
            <p className="text-xs text-gray-600">across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MousePointer className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(mockCampaigns.reduce((sum, c) => sum + c.totalInteractions, 0))}
            </div>
            <p className="text-xs text-gray-600">user interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.73%</div>
            <p className="text-xs text-gray-600">click-through rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>View and manage all advertising campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign ID</TableHead>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Interactions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.id}</TableCell>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{campaign.endDate.toLocaleDateString()}</TableCell>
                  <TableCell>{formatNumber(campaign.totalImpressions)}</TableCell>
                  <TableCell>{formatNumber(campaign.totalInteractions)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCampaign(campaign.id)}
                    >
                      Manage
                    </Button>
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