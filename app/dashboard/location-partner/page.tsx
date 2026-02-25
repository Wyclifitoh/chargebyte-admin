'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Activity,
  Battery,
  Download,
} from 'lucide-react';
import { mockStations, mockRevenueShares, mockAnalytics } from '@/lib/mock-services/mock-data';

export default function LocationPartnerDashboard() {
  const partnerStations = mockStations.filter(s => s.partnerId === '4');
  const revenueShare = mockRevenueShares[0];

  const stats = [
    {
      title: 'Total Revenue Share',
      value: `KES ${revenueShare.partnerShare.toLocaleString()}`,
      change: '+20% from last month',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'My Stations',
      value: partnerStations.length,
      change: `${partnerStations.filter(s => s.status === 'active').length} active`,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Rentals',
      value: revenueShare.totalRentals.toLocaleString(),
      change: '+12% this month',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Share Percentage',
      value: `${revenueShare.sharePercentage}%`,
      change: 'of rental revenue',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600">Track your stations and revenue share</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
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
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Breakdown
          </CardTitle>
          <CardDescription className="text-orange-700">
            February 2024 • Status: {revenueShare.status}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Rental Revenue</p>
              <p className="text-2xl font-bold text-orange-900">
                KES {revenueShare.rentalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your Share ({revenueShare.sharePercentage}%)</p>
              <p className="text-2xl font-bold text-green-600">
                KES {revenueShare.partnerShare.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Platform Share</p>
              <p className="text-2xl font-bold text-gray-700">
                KES {revenueShare.platformShare.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Revenue share applies only to rental fees, not deposits
              </span>
              <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300">
                {revenueShare.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            My Stations
          </CardTitle>
          <CardDescription>Performance overview of your charging stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerStations.map((station) => (
              <div
                key={station.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{station.name}</h3>
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
                    <p className="text-sm text-gray-600">{station.location}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Capacity</p>
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {station.availablePowerbanks}/{station.capacity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Rentals</p>
                    <p className="font-semibold text-gray-900">{station.totalRentals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Revenue Generated</p>
                    <p className="font-semibold text-gray-900">
                      KES {station.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Your Share (20%)</p>
                    <p className="font-semibold text-green-600">
                      KES {(station.revenue * 0.2).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">January 2024</p>
                  <p className="text-sm text-gray-600">Paid on Feb 5, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">KES 62,340</p>
                  <Badge className="bg-green-100 text-green-700 text-xs">Paid</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">December 2023</p>
                  <p className="text-sm text-gray-600">Paid on Jan 5, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">KES 58,920</p>
                  <Badge className="bg-green-100 text-green-700 text-xs">Paid</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-orange-300">
                <div>
                  <p className="font-medium text-gray-900">February 2024</p>
                  <p className="text-sm text-gray-600">Expected: Mar 5, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">KES {revenueShare.partnerShare.toLocaleString()}</p>
                  <Badge className="bg-orange-100 text-orange-700 text-xs">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Best Performing Station</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">JKIA Terminal 1</p>
              <p className="text-xs text-gray-600">890 rentals this month</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Average Revenue/Station</span>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">
                KES {(revenueShare.rentalRevenue / partnerStations.length).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Per month</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Utilization Rate</span>
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">73%</p>
              <p className="text-xs text-gray-600">Above target (60%)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
