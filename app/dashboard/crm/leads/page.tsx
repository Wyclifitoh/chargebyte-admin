'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  UserPlus,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockLeads = [
  {
    id: 'L001',
    name: 'Westgate Shopping Mall',
    contact: 'James Mwangi',
    email: 'james@westgate.co.ke',
    phone: '+254 720 123 456',
    type: 'Location Partner',
    status: 'hot',
    source: 'Referral',
    value: 500000,
    lastContact: '2024-02-24',
    nextFollowup: '2024-02-26',
    notes: 'Interested in 3 stations for main entrance and food court',
  },
  {
    id: 'L002',
    name: 'SafaricomPLC',
    contact: 'Sarah Njeri',
    email: 'sarah.njeri@safaricom.co.ke',
    phone: '+254 711 234 567',
    type: 'Sponsor',
    status: 'warm',
    source: 'LinkedIn',
    value: 2000000,
    lastContact: '2024-02-23',
    nextFollowup: '2024-02-27',
    notes: 'CSR initiative - wants to sponsor 10 locations in underserved areas',
  },
  {
    id: 'L003',
    name: 'The Hub Karen',
    contact: 'David Omondi',
    email: 'david@thehub.co.ke',
    phone: '+254 722 345 678',
    type: 'Location Partner',
    status: 'hot',
    source: 'Cold Call',
    value: 300000,
    lastContact: '2024-02-25',
    nextFollowup: '2024-02-26',
    notes: 'Ready to sign - waiting for contract review',
  },
  {
    id: 'L004',
    name: 'Coca-Cola Kenya',
    contact: 'Ann Wambui',
    email: 'ann.wambui@cocacola.co.ke',
    phone: '+254 733 456 789',
    type: 'Advertiser',
    status: 'warm',
    source: 'Website',
    value: 1500000,
    lastContact: '2024-02-22',
    nextFollowup: '2024-02-28',
    notes: 'Interested in station branding and ad campaigns',
  },
  {
    id: 'L005',
    name: 'Java House',
    contact: 'Michael Kimani',
    email: 'michael@javahouse.co.ke',
    phone: '+254 744 567 890',
    type: 'Location Partner',
    status: 'cold',
    source: 'Email Campaign',
    value: 250000,
    lastContact: '2024-02-20',
    nextFollowup: '2024-03-01',
    notes: 'Initial interest shown - needs more information',
  },
];

export default function CRMLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState(mockLeads);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    type: 'Location Partner',
    value: '',
    notes: '',
  });

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) {
      toast.error('Please fill in name and email');
      return;
    }

    const lead = {
      id: `L${(leads.length + 1).toString().padStart(3, '0')}`,
      ...newLead,
      value: parseInt(newLead.value) || 0,
      status: 'cold',
      source: 'Manual Entry',
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setLeads([lead, ...leads]);
    setNewLead({ name: '', contact: '', email: '', phone: '', type: 'Location Partner', value: '', notes: '' });
    setIsAddDialogOpen(false);
    toast.success('Lead added successfully!');
  };

  const handleConvertToCustomer = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      toast.success(`${lead.name} converted to customer!`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'warm':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cold':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = [
    { label: 'Total Leads', value: leads.length, color: 'text-blue-600' },
    { label: 'Hot Leads', value: leads.filter(l => l.status === 'hot').length, color: 'text-red-600' },
    { label: 'Warm Leads', value: leads.filter(l => l.status === 'warm').length, color: 'text-orange-600' },
    { label: 'Cold Leads', value: leads.filter(l => l.status === 'cold').length, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">Track and convert your sales leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                  Add a new potential customer to your pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Company/Organization Name *</Label>
                  <Input
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Westgate Shopping Mall"
                  />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={newLead.contact}
                    onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <select
                      value={newLead.type}
                      onChange={(e) => setNewLead({ ...newLead, type: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-gray-200"
                    >
                      <option value="Location Partner">Location Partner</option>
                      <option value="Sponsor">Sponsor</option>
                      <option value="Advertiser">Advertiser</option>
                    </select>
                  </div>
                  <div>
                    <Label>Potential Value (KES)</Label>
                    <Input
                      type="number"
                      value={newLead.value}
                      onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                      placeholder="500000"
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="Additional information about this lead..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddLead} className="w-full">
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Leads</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                          <p className="text-sm text-gray-600">{lead.contact}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <UserPlus className="h-4 w-4" />
                          <span>{lead.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Follow-up: {new Date(lead.nextFollowup).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Potential Value</p>
                          <p className="text-lg font-bold text-emerald-600">
                            KES {lead.value.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Source</p>
                          <p className="text-sm font-medium text-gray-900">{lead.source}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Contact</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(lead.lastContact).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {lead.notes}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`Call scheduled with ${lead.contact}`)}
                        >
                          Schedule Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`Email sent to ${lead.email}`)}
                        >
                          Send Email
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleConvertToCustomer(lead.id)}
                        >
                          Convert to Customer
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
