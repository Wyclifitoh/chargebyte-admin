'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  TrendingUp,
  Award,
  Target,
  Download,
  Star,
  Search,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const performanceData = [
  {
    id: '1',
    name: 'Mary Wanjiru',
    role: 'Sales Manager',
    location: 'Westlands',
    overallScore: 96,
    conversions: 67,
    customerSatisfaction: 4.8,
    punctuality: 98,
    revenueGenerated: 2450000,
    targets: { met: 12, total: 12 },
  },
  {
    id: '2',
    name: 'John Kamau',
    role: 'Field Agent',
    location: 'Nairobi CBD',
    overallScore: 92,
    conversions: 45,
    customerSatisfaction: 4.6,
    punctuality: 95,
    revenueGenerated: 1850000,
    targets: { met: 10, total: 12 },
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    role: 'Field Agent',
    location: 'Eastleigh',
    overallScore: 88,
    conversions: 38,
    customerSatisfaction: 4.5,
    punctuality: 92,
    revenueGenerated: 1620000,
    targets: { met: 9, total: 12 },
  },
  {
    id: '4',
    name: 'Grace Muthoni',
    role: 'Field Agent',
    location: 'Thika',
    overallScore: 85,
    conversions: 29,
    customerSatisfaction: 4.4,
    punctuality: 90,
    revenueGenerated: 1350000,
    targets: { met: 8, total: 12 },
  },
];

export default function PerformancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredData = performanceData.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 75) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const avgScore = Math.round(performanceData.reduce((sum, m) => sum + m.overallScore, 0) / performanceData.length);
  const totalRevenue = performanceData.reduce((sum, m) => sum + m.revenueGenerated, 0);
  const totalConversions = performanceData.reduce((sum, m) => sum + m.conversions, 0);
  const avgSatisfaction = (performanceData.reduce((sum, m) => sum + m.customerSatisfaction, 0) / performanceData.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-gray-600">Track individual and team metrics</p>
        </div>
        <Button variant="outline" onClick={() => toast.success('Performance report exported!')}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">KES {(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{avgSatisfaction}/5</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Performance Metrics</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Field Agent">Field Agent</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Performance Score</TableHead>
                  <TableHead className="text-center">Conversions</TableHead>
                  <TableHead className="text-center">Satisfaction</TableHead>
                  <TableHead className="text-center">Punctuality</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-center">Targets</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No performance data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getScoreBadgeClass(member.overallScore)}>
                          <span className={`text-lg font-bold ${getScoreColor(member.overallScore)}`}>
                            {member.overallScore}%
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-gray-900">{member.conversions}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{member.customerSatisfaction}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-gray-900">{member.punctuality}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-gray-900">
                          KES {(member.revenueGenerated / 1000).toFixed(0)}K
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-gray-900">
                          {member.targets.met}/{member.targets.total}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('View detailed performance report')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
