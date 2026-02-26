'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Plus, Calendar, User, Search, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockReports = [
  {
    id: 'R001',
    member: 'John Kamau',
    date: '2024-02-25',
    type: 'Daily Report',
    summary: 'Completed customer visits in CBD area. Met with 3 potential location partners.',
    leads: 3,
    challenges: 'Heavy traffic delayed afternoon meetings',
  },
  {
    id: 'R002',
    member: 'Mary Wanjiru',
    date: '2024-02-25',
    type: 'Weekly Report',
    summary: 'Successfully closed 2 new location partnerships. Team training conducted.',
    leads: 8,
    challenges: 'None',
  },
  {
    id: 'R003',
    member: 'Peter Ochieng',
    date: '2024-02-24',
    type: 'Daily Report',
    summary: 'Conducted market research in Eastleigh area. Identified 5 potential clients.',
    leads: 5,
    challenges: 'Language barrier with some potential clients',
  },
  {
    id: 'R004',
    member: 'Grace Muthoni',
    date: '2024-02-24',
    type: 'Daily Report',
    summary: 'Completed follow-ups with existing customers. Generated positive feedback.',
    leads: 2,
    challenges: 'None',
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [newReport, setNewReport] = useState({
    summary: '',
    leads: '',
    challenges: '',
  });

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = () => {
    if (!newReport.summary) {
      toast.error('Please fill in report summary');
      return;
    }

    const report = {
      id: `R${(reports.length + 1).toString().padStart(3, '0')}`,
      member: 'Current User',
      date: new Date().toISOString().split('T')[0],
      type: 'Daily Report',
      summary: newReport.summary,
      leads: parseInt(newReport.leads) || 0,
      challenges: newReport.challenges,
    };

    setReports([report, ...reports]);
    setNewReport({ summary: '', leads: '', challenges: '' });
    setIsDialogOpen(false);
    toast.success('Report submitted successfully!');
  };

  const totalReports = reports.length;
  const totalLeads = reports.reduce((sum, r) => sum + r.leads, 0);
  const dailyReports = reports.filter(r => r.type === 'Daily Report').length;
  const weeklyReports = reports.filter(r => r.type === 'Weekly Report').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-600">Submit and view team activity reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success('Reports exported!')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Daily Report</DialogTitle>
                <DialogDescription>
                  Provide details about your activities and achievements
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Summary</Label>
                  <Textarea
                    placeholder="Describe your activities and achievements..."
                    value={newReport.summary}
                    onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>New Leads Generated</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newReport.leads}
                    onChange={(e) => setNewReport({ ...newReport, leads: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Challenges Faced</Label>
                  <Textarea
                    placeholder="Any obstacles or challenges..."
                    value={newReport.challenges}
                    onChange={(e) => setNewReport({ ...newReport, challenges: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Daily Reports</p>
                <p className="text-2xl font-bold text-gray-900">{dailyReports}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Weekly Reports</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyReports}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Reports History</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Daily Report">Daily Report</SelectItem>
                  <SelectItem value="Weekly Report">Weekly Report</SelectItem>
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
                  <TableHead>Report ID</TableHead>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="text-center">Leads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span className="font-medium text-gray-900">{report.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {report.member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-gray-900">{report.member}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          report.type === 'Daily Report'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }>
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-md truncate">
                          {report.summary}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-gray-900">{report.leads}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('View full report details')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
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
