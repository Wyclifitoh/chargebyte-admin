'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  TrendingUp,
  Award,
  Target,
  Download,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

const performanceData = [
  {
    id: '1',
    name: 'Mary Wanjiru',
    role: 'Sales Manager',
    overallScore: 96,
    activations: 203,
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
    overallScore: 92,
    activations: 156,
    conversions: 45,
    customerSatisfaction: 4.6,
    punctuality: 95,
    revenueGenerated: 1850000,
    targets: { met: 10, total: 12 },
  },
];

export default function PerformancePage() {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    return 'bg-yellow-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-gray-600">Track individual and team metrics</p>
        </div>
        <Button variant="outline" onClick={() => toast.success('Report exported!')}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {performanceData.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className={`text-center p-4 rounded-xl ${getScoreBg(member.overallScore)}`}>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className={`text-4xl font-bold ${getScoreColor(member.overallScore)}`}>
                    {member.overallScore}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Activations</p>
                  <p className="text-2xl font-bold">{member.activations}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold">{member.conversions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">KES {(member.revenueGenerated / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
