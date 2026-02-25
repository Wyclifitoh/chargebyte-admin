'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  BarChart3,
  Plus,
} from 'lucide-react';
import { mockAdCampaigns } from '@/lib/mock-services/mock-data';

export default function AdvertisingPartnerDashboard() {
  const activeCampaigns = mockAdCampaigns.filter(c => c.status === 'active');
  const totalImpressions = mockAdCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = mockAdCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalSpent = mockAdCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = mockAdCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  const stats = [
    {
      title: 'Total Impressions',
      value: totalImpressions.toLocaleString(),
      change: '+24% this month',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      change: `${avgCTR}% CTR`,
      icon: MousePointerClick,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Spent',
      value: `KES ${totalSpent.toLocaleString()}`,
      change: `${totalBudget.toLocaleString()} budget`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns.length,
      change: `${mockAdCampaigns.length} total`,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertising Dashboard</h1>
          <p className="text-gray-600">Manage your ad campaigns and track performance</p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-pink-600" />
            Campaign Performance
          </CardTitle>
          <CardDescription>Track your advertising campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAdCampaigns.map((campaign) => {
              const ctr = campaign.impressions > 0
                ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
                : 0;
              const budgetUsed = campaign.budget > 0
                ? ((campaign.spent / campaign.budget) * 100).toFixed(0)
                : 0;

              return (
                <div
                  key={campaign.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          campaign.status === 'active'
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <BarChart3
                          className={`h-5 w-5 ${
                            campaign.status === 'active'
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <Badge
                            variant={campaign.status === 'active' ? 'default' : 'secondary'}
                            className={
                              campaign.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Impressions</p>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {campaign.impressions.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Clicks</p>
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {campaign.clicks.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CTR</p>
                      <span className="font-semibold text-blue-600">{ctr}%</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Spent</p>
                      <span className="font-semibold text-gray-900">
                        KES {campaign.spent.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <span className="font-semibold text-gray-900">
                        KES {campaign.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Budget Usage</span>
                      <span className="font-medium text-gray-900">{budgetUsed}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          Number(budgetUsed) > 80
                            ? 'bg-red-500'
                            : Number(budgetUsed) > 60
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${budgetUsed}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-900">Campaign Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Best Performing</span>
                <TrendingUp className="h-4 w-4 text-pink-600" />
              </div>
              <p className="font-semibold text-gray-900">Product Launch</p>
              <p className="text-xs text-gray-600">CTR: 11.07%</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Average CPC</span>
                <DollarSign className="h-4 w-4 text-pink-600" />
              </div>
              <p className="font-semibold text-gray-900">KES 7.21</p>
              <p className="text-xs text-gray-600">Cost per click</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Total Reach</span>
                <Eye className="h-4 w-4 text-pink-600" />
              </div>
              <p className="font-semibold text-gray-900">{totalImpressions.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Unique impressions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Total Budget</span>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900">KES {totalBudget.toLocaleString()}</p>
              <p className="text-xs text-gray-600">All campaigns</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Total Spent</span>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900">KES {totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-600">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Remaining Budget</span>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <p className="font-semibold text-green-600">
                KES {(totalBudget - totalSpent).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Available to spend</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
