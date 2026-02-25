'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Plus, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockReports = [
  {
    id: 'R001',
    member: 'John Kamau',
    date: '2024-02-25',
    type: 'Daily Report',
    summary: 'Completed 12 activations in CBD area. Met with 3 potential location partners.',
    activations: 12,
    leads: 3,
    challenges: 'Heavy traffic delayed afternoon meetings',
  },
  {
    id: 'R002',
    member: 'Mary Wanjiru',
    date: '2024-02-25',
    type: 'Weekly Report',
    summary: 'Successfully closed 2 new location partnerships. Team training conducted.',
    activations: 45,
    leads: 8,
    challenges: 'None',
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    summary: '',
    activations: '',
    leads: '',
    challenges: '',
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
      activations: parseInt(newReport.activations) || 0,
      leads: parseInt(newReport.leads) || 0,
      challenges: newReport.challenges,
    };

    setReports([report, ...reports]);
    setNewReport({ summary: '', activations: '', leads: '', challenges: '' });
    setIsDialogOpen(false);
    toast.success('Report submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-600">Submit and view team activity reports</p>
        </div>
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
                Provide details about today&apos;s activities and achievements
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Activations Completed</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newReport.activations}
                    onChange={(e) => setNewReport({ ...newReport, activations: e.target.value })}
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

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.type}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {report.member}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600">Activations</p>
                    <p className="text-lg font-bold text-blue-600">{report.activations}</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600">Leads</p>
                    <p className="text-lg font-bold text-purple-600">{report.leads}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Summary</p>
                  <p className="text-gray-700">{report.summary}</p>
                </div>
                {report.challenges && report.challenges !== 'None' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Challenges</p>
                    <p className="text-gray-600">{report.challenges}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
