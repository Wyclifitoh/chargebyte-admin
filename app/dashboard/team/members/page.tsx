'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Filter,
  Download,
  Eye,
  FileText,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockTeamMembers = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@chargebyte.io',
    phone: '+254 712 345 678',
    role: 'Field Agent',
    location: 'Nairobi CBD',
    joinDate: '2024-01-15',
    status: 'active',
    performance: 92,
    activations: 156,
    leadsConverted: 45,
  },
  {
    id: '2',
    name: 'Mary Wanjiru',
    email: 'mary.wanjiru@chargebyte.io',
    phone: '+254 723 456 789',
    role: 'Sales Manager',
    location: 'Westlands',
    joinDate: '2023-11-20',
    status: 'active',
    performance: 96,
    activations: 203,
    leadsConverted: 67,
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    email: 'peter.ochieng@chargebyte.io',
    phone: '+254 734 567 890',
    role: 'Field Agent',
    location: 'Eastleigh',
    joinDate: '2024-02-01',
    status: 'active',
    performance: 88,
    activations: 134,
    leadsConverted: 38,
  },
  {
    id: '4',
    name: 'Grace Muthoni',
    email: 'grace.muthoni@chargebyte.io',
    phone: '+254 745 678 901',
    role: 'Field Agent',
    location: 'Thika',
    joinDate: '2024-01-10',
    status: 'on_leave',
    performance: 85,
    activations: 98,
    leadsConverted: 29,
  },
];

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Field Agent',
    location: '',
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast.error('Please fill in name and email');
      return;
    }
    toast.success(`${newMember.name} added to team successfully!`);
    setNewMember({ name: '', email: '', phone: '', role: 'Field Agent', location: '' });
    setIsAddDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Team members data exported successfully!');
  };

  const handleViewProfile = (member: any) => {
    setSelectedMember(member);
    setIsProfileDialogOpen(true);
  };

  const handleViewReport = (member: any) => {
    setSelectedMember(member);
    setIsReportDialogOpen(true);
  };

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your team and track performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new member to your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="john@chargebyte.io"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="+254 712 345 678"
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-gray-200"
                >
                  <option value="Field Agent">Field Agent</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newMember.location}
                  onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                  placeholder="Nairobi CBD"
                />
              </div>
              <Button onClick={handleAddMember} className="w-full">
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{mockTeamMembers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTeamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mockTeamMembers.reduce((sum, m) => sum + m.performance, 0) / mockTeamMembers.length)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Activations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTeamMembers.reduce((sum, m) => sum + m.activations, 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Team Directory</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Field Agent">Field Agent</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Performance</TableHead>
                  <TableHead className="text-center">Leads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No team members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">
                              Joined {new Date(member.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {member.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[180px]">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3.5 w-3.5" />
                            {member.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center justify-center">
                          <div className={`text-lg font-bold ${
                            member.performance >= 90 ? 'text-green-600' :
                            member.performance >= 80 ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {member.performance}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {member.leadsConverted}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={member.status === 'active' ? 'default' : 'secondary'}
                          className={member.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'}
                        >
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfile(member)}
                            className="h-8"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Profile
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(member)}
                            className="h-8"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedMember.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
                  <p className="text-emerald-600 font-medium">{selectedMember.role}</p>
                  <Badge className={selectedMember.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {selectedMember.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium text-gray-900">{selectedMember.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Join Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedMember.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Performance Score</p>
                    <p className="font-medium text-emerald-600 text-2xl">{selectedMember.performance}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Total Activations</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedMember.activations}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Leads Converted</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedMember.leadsConverted}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {Math.round((selectedMember.leadsConverted / selectedMember.activations) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Performance Report</DialogTitle>
            <DialogDescription>
              {selectedMember?.name} - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Activations</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedMember.activations}</p>
                    <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedMember.leadsConverted}</p>
                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedMember.performance}%</p>
                    <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">KES 45K</p>
                    <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">New client onboarding - Westgate Mall</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Station maintenance - CBD Location</span>
                    <span className="text-xs text-gray-500">5 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Lead conversion - Tech Startup</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.success('Report downloaded!')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
