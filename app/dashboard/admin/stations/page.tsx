'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStations } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Battery,
  Power,
  Settings
} from 'lucide-react';

export default function StationsPage() {
  const { hasPermission } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStation, setEditingStation] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    partner: '',
    region: '',
    totalSlots: '12'
  });

  if (!hasPermission(['super_admin', 'staff'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const handleCreateStation = () => {
    // Mock creation - in real app, would call API
    console.log('Creating station:', formData);
    setShowCreateDialog(false);
    setFormData({ name: '', location: '', partner: '', region: '', totalSlots: '12' });
  };

  const handleDeleteStation = (stationId: string) => {
    if (confirm('Are you sure you want to delete this station?')) {
      // Mock deletion - in real app, would call API
      console.log('Deleting station:', stationId);
    }
  };

  const handlePopOutPowerbanks = (stationId: string) => {
    if (confirm('Pop out all powerbanks from this station? This action cannot be undone.')) {
      // Mock pop-out - in real app, would call API
      console.log('Popping out powerbanks from station:', stationId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Station Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage charging stations</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Station
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Station</DialogTitle>
              <DialogDescription>
                Add a new charging station to the network
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Station name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="col-span-3"
                  placeholder="Physical location"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="partner" className="text-right">
                  Partner
                </Label>
                <Input
                  id="partner"
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  className="col-span-3"
                  placeholder="Partner company"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Region
                </Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slots" className="text-right">
                  Total Slots
                </Label>
                <Input
                  id="slots"
                  type="number"
                  value={formData.totalSlots}
                  onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })}
                  className="col-span-3"
                  placeholder="Number of slots"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateStation} className="bg-primary-500 hover:bg-primary-600">
                Create Station
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Station Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            
            <div className="text-2xl font-bold">{mockStations.length}</div>
            <p className="text-xs text-gray-600">network-wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <Power className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              
              {mockStations.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-gray-600">currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
            <Battery className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStations.reduce((sum, s) => sum + s.totalSlots, 0)}
              {/* 1204 */}
            </div>
            <p className="text-xs text-gray-600">charging slots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStations.reduce((sum, s) => sum + s.availableSlots, 0)}
              {/* 640 */}
            </div>
            <p className="text-xs text-gray-600">ready for rental</p>
          </CardContent>
        </Card>
      </div>

      {/* Stations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Stations</CardTitle>
          <CardDescription>Manage your charging station network</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.id}</TableCell>
                  <TableCell>{station.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{station.location}</TableCell>
                  <TableCell>{station.partner}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {station.region}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={station.status === 'active' ? 'default' : 'secondary'}
                      className={station.status === 'active' ? 'bg-emerald-100 text-emerald-700' : ''}
                    >
                      {station.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{station.availableSlots}/{station.totalSlots}</TableCell>
                  <TableCell>${station.revenue.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStation(station.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePopOutPowerbanks(station.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStation(station.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}