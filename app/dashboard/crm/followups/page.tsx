'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  PhoneCall,
  Plus,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Search,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockFollowups = [
  {
    id: 'F001',
    leadName: 'Westgate Shopping Mall',
    contact: 'James Mwangi',
    email: 'james@westgate.co.ke',
    phone: '+254 720 123 456',
    type: 'Call',
    dueDate: '2024-02-26',
    priority: 'high',
    status: 'pending',
    notes: 'Follow up on contract signing',
    assignedTo: 'John Kamau',
  },
  {
    id: 'F002',
    leadName: 'Safaricom PLC',
    contact: 'Sarah Njeri',
    email: 'sarah@safaricom.co.ke',
    phone: '+254 711 234 567',
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
    email: 'michael@javahouse.co.ke',
    phone: '+254 744 567 890',
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
    email: 'ann@cocacola.co.ke',
    phone: '+254 733 456 789',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    leadName: '',
    contact: '',
    email: '',
    phone: '',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call':
        return <PhoneCall className="h-4 w-4" />;
      case 'Email':
        return <Mail className="h-4 w-4" />;
      case 'Meeting':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <PhoneCall className="h-4 w-4" />;
    }
  };

  const handleAddFollowup = () => {
    if (!newFollowup.leadName || !newFollowup.dueDate) {
      toast.error('Please fill in lead name and due date');
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
      email: '',
      phone: '',
      type: 'Call',
      dueDate: '',
      priority: 'medium',
      notes: '',
    });
    setIsAddDialogOpen(false);
    toast.success('Follow-up scheduled successfully!');
  };

  const handleComplete = (id: string) => {
    setFollowups(prev =>
      prev.map(f => f.id === id ? { ...f, status: 'completed' } : f)
    );
    toast.success('Follow-up marked as completed!');
  };

  const handleExport = () => {
    toast.success('Follow-ups exported successfully!');
  };

  const filteredFollowups = followups.filter(followup => {
    const matchesSearch = followup.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followup.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || followup.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || followup.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newFollowup.email}
                      onChange={(e) => setNewFollowup({ ...newFollowup, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={newFollowup.phone}
                      onChange={(e) => setNewFollowup({ ...newFollowup, phone: e.target.value })}
                      placeholder="+254 712 345 678"
                    />
                  </div>
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Follow-ups</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Follow-ups</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search follow-ups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
                  <TableHead>Lead/Customer</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFollowups.map((followup) => (
                  <TableRow key={followup.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{followup.leadName}</p>
                        <p className="text-sm text-gray-600">{followup.contact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{followup.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PhoneCall className="h-3 w-3 text-gray-400" />
                          <span>{followup.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(followup.type)}
                        <span className="text-sm">{followup.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(followup.priority)}>
                        {followup.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(followup.status)}>
                        {followup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{new Date(followup.dueDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-gray-400" />
                        <span>{followup.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {followup.notes}
                      </p>
                    </TableCell>
                    <TableCell>
                      {followup.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleComplete(followup.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Done
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredFollowups.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No follow-ups found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
