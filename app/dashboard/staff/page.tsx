'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { mockRentals, mockAnalytics } from '@/lib/mock-services/mock-data';
import { useState } from 'react';

export default function StaffDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      title: 'Active Rentals',
      value: mockAnalytics.activeRentals,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Today Revenue',
      value: `KES ${mockAnalytics.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Completed Today',
      value: '45',
      icon: CheckCircle2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Overdue',
      value: '3',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Manage rentals and customer activations</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          New Rental
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rental Management</CardTitle>
              <CardDescription>Track and manage all active rentals</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer or rental ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRentals.map((rental) => (
              <div
                key={rental.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      rental.status === 'active'
                        ? 'bg-blue-100'
                        : rental.status === 'completed'
                        ? 'bg-green-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    <Zap
                      className={`h-5 w-5 ${
                        rental.status === 'active'
                          ? 'text-blue-600'
                          : rental.status === 'completed'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{rental.customerName}</p>
                      <Badge
                        variant="outline"
                        className={
                          rental.status === 'active'
                            ? 'border-blue-300 text-blue-700'
                            : rental.status === 'completed'
                            ? 'border-green-300 text-green-700'
                            : 'border-orange-300 text-orange-700'
                        }
                      >
                        {rental.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {rental.stationName} • {rental.powerbankId}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Rental: {rental.id}</span>
                      <span>Deposit: KES {rental.deposit}</span>
                      <span>Rate: KES {rental.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {rental.status === 'active' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.floor(
                          (new Date().getTime() - new Date(rental.startTime).getTime()) /
                            (1000 * 60 * 60)
                        )}
                        h
                      </span>
                    </div>
                  )}
                  {rental.status === 'completed' && rental.refund !== undefined && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Refund</p>
                      <p className="font-semibold text-green-600">KES {rental.refund}</p>
                    </div>
                  )}
                  <Button
                    variant={rental.status === 'active' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {rental.status === 'active' ? 'End Rental' : 'View Details'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start bg-white text-gray-900 hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-2" />
              New Customer Activation
            </Button>
            <Button className="w-full justify-start bg-white text-gray-900 hover:bg-gray-50">
              <Zap className="h-4 w-4 mr-2" />
              Start New Rental
            </Button>
            <Button className="w-full justify-start bg-white text-gray-900 hover:bg-gray-50">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Process Return
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Today's Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-700">Rentals Processed</span>
              <span className="font-bold text-blue-600">45</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-700">Revenue Generated</span>
              <span className="font-bold text-blue-600">KES {mockAnalytics.todayRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-700">Average Duration</span>
              <span className="font-bold text-blue-600">{mockAnalytics.averageRentalDuration}h</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
