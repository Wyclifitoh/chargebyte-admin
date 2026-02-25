'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Award,
} from 'lucide-react';
import { mockSponsorships } from '@/lib/mock-services/mock-data';

export default function SponsorDashboard() {
  const totalContributions = mockSponsorships.reduce((sum, s) => sum + s.amount, 0);
  const totalBeneficiaries = mockSponsorships.reduce((sum, s) => sum + s.beneficiaries, 0);
  const totalStations = mockSponsorships.reduce((sum, s) => sum + s.stationsSponsored, 0);
  const activeSponsorship = mockSponsorships.filter(s => s.status === 'active').length;

  const stats = [
    {
      title: 'Total Contributions',
      value: `KES ${totalContributions.toLocaleString()}`,
      change: '2 active projects',
      icon: DollarSign,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      title: 'People Impacted',
      value: totalBeneficiaries.toLocaleString(),
      change: 'Community members',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Sponsored Stations',
      value: totalStations,
      change: 'Active locations',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Impact Score',
      value: '95%',
      change: 'Excellent',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsor Dashboard</h1>
          <p className="text-gray-600">Track your contributions and community impact</p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <Heart className="h-4 w-4 mr-2" />
          New Sponsorship
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

      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-900 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Impact Overview
          </CardTitle>
          <CardDescription className="text-cyan-700">
            Making a difference in underserved communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Investment</p>
              <p className="text-2xl font-bold text-cyan-900">
                KES {totalContributions.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Lifetime contributions</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Community Reach</p>
              <p className="text-2xl font-bold text-green-600">
                {totalBeneficiaries.toLocaleString()}+
              </p>
              <p className="text-xs text-gray-600 mt-1">People served</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-purple-600">
                {activeSponsorship}
              </p>
              <p className="text-xs text-gray-600 mt-1">Ongoing initiatives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-600" />
            Sponsored Locations
          </CardTitle>
          <CardDescription>Charging stations you're supporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSponsorships.map((sponsorship) => (
              <div
                key={sponsorship.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Heart className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{sponsorship.location}</h3>
                        <Badge
                          variant={sponsorship.status === 'active' ? 'default' : 'secondary'}
                          className="bg-green-100 text-green-700"
                        >
                          {sponsorship.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sponsored on {new Date(sponsorship.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Your Contribution</p>
                    <p className="font-semibold text-cyan-600">
                      KES {sponsorship.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Stations</p>
                    <p className="font-semibold text-gray-900">{sponsorship.stationsSponsored}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Beneficiaries</p>
                    <p className="font-semibold text-green-600">
                      {sponsorship.beneficiaries}+
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Impact Level</p>
                    <Badge className="bg-orange-100 text-orange-700">High</Badge>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Impact:</strong> Providing free charging access to{' '}
                    {sponsorship.beneficiaries} community members daily, supporting local
                    businesses and educational access.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Community Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Daily Active Users</span>
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">234</p>
              <p className="text-xs text-gray-600">Across sponsored locations</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Free Charges Provided</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">1,847</p>
              <p className="text-xs text-gray-600">This month</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Community Satisfaction</span>
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">4.8/5.0</p>
              <p className="text-xs text-gray-600">Based on user feedback</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Recognition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-white rounded-lg border-2 border-purple-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Gold Sponsor</p>
                  <p className="text-xs text-gray-600">Tier Level</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Recognized for outstanding contributions to community empowerment
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Tax Benefits:</strong>
              </p>
              <p className="text-xs text-gray-600">
                Your contributions qualify for tax deductions under Kenyan CSR
                regulations. Tax receipt available upon request.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Next Milestone:</strong>
              </p>
              <p className="text-xs text-gray-600">
                KES 100,000 more to reach Platinum Sponsor status
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: '83%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank you for making a difference!
              </h3>
              <p className="text-gray-700 mb-4">
                Your sponsorship is providing essential charging services to {totalBeneficiaries}+
                people in underserved communities. Together, we're bridging the digital divide
                and empowering local economies.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  Download Impact Report
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Increase Contribution
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
