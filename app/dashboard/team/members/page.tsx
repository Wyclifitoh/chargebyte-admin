'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Directory</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on_leave">On Leave</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockTeamMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <Badge
                              variant={member.status === 'active' ? 'default' : 'secondary'}
                              className={member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                            >
                              {member.status.replace('_', ' ')}
                            </Badge>
                          </div>

                          <p className="text-sm font-medium text-emerald-600 mb-3">{member.role}</p>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{member.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-500">Performance</p>
                                <p className="text-lg font-bold text-emerald-600">{member.performance}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Activations</p>
                                <p className="text-lg font-bold text-blue-600">{member.activations}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Conversions</p>
                                <p className="text-lg font-bold text-purple-600">{member.leadsConverted}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              View Reports
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockTeamMembers.filter(m => m.status === 'active').map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="on_leave">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockTeamMembers.filter(m => m.status === 'on_leave').map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
