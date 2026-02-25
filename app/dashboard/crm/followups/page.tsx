'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PhoneCall,
  Plus,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockFollowups = [
  {
    id: 'F001',
    leadName: 'Westgate Shopping Mall',
    contact: 'James Mwangi',
    type: 'Call',
    dueDate: '2024-02-26',
    priority: 'high',
    status: 'pending',
    notes: 'Follow up on contract signing',
    assignedTo: 'John Kamau',
  },
  {
    id: 'F002',
    leadName: 'SafaricomPLC',
    contact: 'Sarah Njeri',
    type: 'Meeting',
    dueDate: '2024-02-27',
    priority: 'high',
    status: 'pending',
    notes: 'Present CSR proposal and pricing',
    assignedTo: 'Mary Wanjiru',
  },
  {
    id: 'F003',
    leadName: 'Java House',
    contact: 'Michael Kimani',
    type: 'Email',
    dueDate: '2024-03-01',
    priority: 'medium',
    status: 'pending',
    notes: 'Send product brochure and case studies',
    assignedTo: 'Peter Ochieng',
  },
  {
    id: 'F004',
    leadName: 'Coca-Cola Kenya',
    contact: 'Ann Wambui',
    type: 'Call',
    dueDate: '2024-02-25',
    priority: 'high',
    status: 'completed',
    notes: 'Discussed branding opportunities',
    assignedTo: 'Mary Wanjiru',
  },
];

export default function FollowupsPage() {
  const [followups, setFollowups] = useState(mockFollowups);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    leadName: '',
    contact: '',
    type: 'Call',
    dueDate: '',
    priority: 'medium',
    notes: '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleAddFollowup = () => {
    if (!newFollowup.leadName || !newFollowup.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const followup = {
      id: `F${(followups.length + 1).toString().padStart(3, '0')}`,
      ...newFollowup,
      status: 'pending',
      assignedTo: 'Current User',
    };

    setFollowups([followup, ...followups]);
    setNewFollowup({
      leadName: '',
      contact: '',
      type: 'Call',
      dueDate: '',
      priority: 'medium',
      notes: '',
    });
    setIsDialogOpen(false);
    toast.success('Follow-up scheduled successfully!');
  };

  const handleComplete = (id: string) => {
    setFollowups(prev =>
      prev.map(f => f.id === id ? { ...f, status: 'completed' } : f)
    );
    toast.success('Follow-up marked as completed!');
  };

  const stats = {
    total: followups.length,
    pending: followups.filter(f => f.status === 'pending').length,
    completed: followups.filter(f => f.status === 'completed').length,
    highPriority: followups.filter(f => f.priority === 'high' && f.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-ups</h1>
          <p className="text-gray-600">Track and manage customer follow-ups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Follow-up</DialogTitle>
              <DialogDescription>
                Create a new follow-up task
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Lead/Customer Name *</Label>
                <Input
                  value={newFollowup.leadName}
                  onChange={(e) => setNewFollowup({ ...newFollowup, leadName: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input
                  value={newFollowup.contact}
                  onChange={(e) => setNewFollowup({ ...newFollowup, contact: e.target.value })}
                  placeholder="Enter contact person"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <select
                    value={newFollowup.type}
                    onChange={(e) => setNewFollowup({ ...newFollowup, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <select
                    value={newFollowup.priority}
                    onChange={(e) => setNewFollowup({ ...newFollowup, priority: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={newFollowup.dueDate}
                  onChange={(e) => setNewFollowup({ ...newFollowup, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newFollowup.notes}
                  onChange={(e) => setNewFollowup({ ...newFollowup, notes: e.target.value })}
                  placeholder="Add notes..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddFollowup} className="w-full">
                Schedule Follow-up
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Follow-ups</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">High Priority</p>
            <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
          </CardContent>
        </Card>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {followups.map((followup) => (
          <Card key={followup.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <PhoneCall className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{followup.leadName}</h3>
                      <p className="text-sm text-gray-600">{followup.contact}</p>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(followup.priority)}>
                      {followup.priority.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(followup.status)}
                      <span className="text-sm text-gray-600 capitalize">{followup.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneCall className="h-4 w-4" />
                      <span>{followup.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(followup.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{followup.assignedTo}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{followup.notes}</p>

                  {followup.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(followup.id)}
                      >
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
