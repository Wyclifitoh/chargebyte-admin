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
  UserPlus,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  ArrowRight,
  Download,
  DollarSign,
  Flame,
  TrendingUp,
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
    notes: 'Ready to sign contract - high interest',
  },
  {
    id: 'L002',
    name: 'The Hub Karen',
    contact: 'David Omondi',
    email: 'david@thehub.co.ke',
    phone: '+254 722 345 678',
    type: 'Location Partner',
    status: 'warm',
    source: 'Website Inquiry',
    value: 350000,
    lastContact: '2024-02-22',
    nextFollowup: '2024-02-27',
    notes: 'Needs pricing proposal and timeline',
  },
  {
    id: 'L003',
    name: 'Safaricom PLC',
    contact: 'Sarah Njeri',
    email: 'sarah.njeri@safaricom.co.ke',
    phone: '+254 711 234 567',
    type: 'Sponsor',
    status: 'hot',
    source: 'LinkedIn',
    value: 2000000,
    lastContact: '2024-02-23',
    nextFollowup: '2024-02-27',
    notes: 'Interested in CSR partnership opportunity',
  },
  {
    id: 'L004',
    name: 'Coca-Cola Kenya',
    contact: 'Ann Wambui',
    email: 'ann@cocacola.co.ke',
    phone: '+254 733 456 789',
    type: 'Advertiser',
    status: 'warm',
    source: 'Cold Call',
    value: 1000000,
    lastContact: '2024-02-21',
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
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

  const handleScheduleCall = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    toast.success(`Call scheduled with ${lead?.contact}`);
  };

  const handleExport = () => {
    toast.success('Leads data exported successfully!');
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesType = typeFilter === 'all' || lead.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = [
    { label: 'Total Leads', value: leads.length, color: 'text-blue-600', bgColor: 'border-l-blue-500' },
    { label: 'Hot Leads', value: leads.filter(l => l.status === 'hot').length, color: 'text-red-600', bgColor: 'border-l-red-500' },
    { label: 'Warm Leads', value: leads.filter(l => l.status === 'warm').length, color: 'text-orange-600', bgColor: 'border-l-orange-500' },
    { label: 'Cold Leads', value: leads.filter(l => l.status === 'cold').length, color: 'text-blue-600', bgColor: 'border-l-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">Track and convert your sales leads</p>
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
        {stats.map((stat, index) => (
          <Card key={index} className={`border-l-4 ${stat.bgColor}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                {stat.label === 'Hot Leads' && <Flame className="h-8 w-8 text-red-500" />}
                {stat.label === 'Total Leads' && <UserPlus className="h-8 w-8 text-blue-500" />}
                {stat.label === 'Warm Leads' && <TrendingUp className="h-8 w-8 text-orange-500" />}
                {stat.label === 'Cold Leads' && <UserPlus className="h-8 w-8 text-blue-400" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Leads</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
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
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Location Partner">Location Partner</SelectItem>
                  <SelectItem value="Sponsor">Sponsor</SelectItem>
                  <SelectItem value="Advertiser">Advertiser</SelectItem>
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
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Next Follow-up</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {lead.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.contact}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{lead.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-emerald-600">
                          KES {(lead.value / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{lead.source}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(lead.lastContact).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{new Date(lead.nextFollowup).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScheduleCall(lead.id)}
                        >
                          Schedule
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleConvertToCustomer(lead.id)}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Convert
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leads found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
