'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { mockStations, mockPowerbanks } from '@/lib/mock-data';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  Battery,
  Plus,
  Search,
  Filter,
  Power,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function PowerbanksPage() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPowerbank, setSelectedPowerbank] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    stationId: '',
    slotNumber: '',
    serialNumber: '',
    batteryLevel: '100'
  });

  if (!hasPermission(['super_admin', 'staff'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const filteredPowerbanks = mockPowerbanks.filter(powerbank => {
    const matchesSearch = searchTerm === '' || 
      powerbank.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      powerbank.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      powerbank.stationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStation = stationFilter === 'all' || powerbank.stationId === stationFilter;
    const matchesStatus = statusFilter === 'all' || powerbank.status === statusFilter;
    return matchesSearch && matchesStation && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'rented': return 'bg-blue-100 text-blue-700';
      case 'charging': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-emerald-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'poor': return <XCircle className="h-4 w-4" />;
      default: return <Battery className="h-4 w-4" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'bg-emerald-500';
    if (level >= 50) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleAddPowerbank = () => {
    console.log('Adding powerbank:', formData);
    setShowAddDialog(false);
    setFormData({ stationId: '', slotNumber: '', serialNumber: '', batteryLevel: '100' });
  };

  const handlePopOut = (powerbankId: string) => {
    if (confirm('Pop out this powerbank? This will make it available for rental.')) {
      console.log('Popping out powerbank:', powerbankId);
    }
  };

  const handleMaintenance = (powerbankId: string) => {
    if (confirm('Mark this powerbank for maintenance?')) {
      console.log('Marking powerbank for maintenance:', powerbankId);
    }
  };

  const handleForceCharge = (powerbankId: string) => {
    if (confirm('Force charge this powerbank?')) {
      console.log('Force charging powerbank:', powerbankId);
    }
  };

  // Calculate stats
  const totalPowerbanks = mockPowerbanks.length;
  const availablePowerbanks = mockPowerbanks.filter(p => p.status === 'available').length;
  const rentedPowerbanks = mockPowerbanks.filter(p => p.status === 'rented').length;
  const maintenancePowerbanks = mockPowerbanks.filter(p => p.status === 'maintenance').length;
  const chargingPowerbanks = mockPowerbanks.filter(p => p.status === 'charging').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Powerbank Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all powerbanks across stations</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Powerbank
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Powerbank</DialogTitle>
              <DialogDescription>
                Register a new powerbank to a station slot
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="station" className="text-right">
                  Station
                </Label>
                <Select value={formData.stationId} onValueChange={(value) => setFormData({ ...formData, stationId: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStations.map(station => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slot" className="text-right">
                  Slot Number
                </Label>
                <Input
                  id="slot"
                  type="number"
                  value={formData.slotNumber}
                  onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="1-20"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serial" className="text-right">
                  Serial Number
                </Label>
                <Input
                  id="serial"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="CB-2024-XXX"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="battery" className="text-right">
                  Battery Level
                </Label>
                <Input
                  id="battery"
                  type="number"
                  value={formData.batteryLevel}
                  onChange={(e) => setFormData({ ...formData, batteryLevel: e.target.value })}
                  className="col-span-3"
                  placeholder="0-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPowerbank} className="bg-primary-500 hover:bg-primary-600">
                Add Powerbank
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Powerbank Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Powerbanks</CardTitle>
            <Battery className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPowerbanks}</div>
            <p className="text-xs text-gray-600">across all stations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePowerbanks}</div>
            <p className="text-xs text-gray-600">ready for rental</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentedPowerbanks}</div>
            <p className="text-xs text-gray-600">currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging</CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chargingPowerbanks}</div>
            <p className="text-xs text-gray-600">being charged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenancePowerbanks}</div>
            <p className="text-xs text-gray-600">need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Powerbanks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Powerbank Inventory</CardTitle>
              <CardDescription>Monitor all powerbanks and their status</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search powerbanks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={stationFilter} onValueChange={setStationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  {mockStations.map(station => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="charging">Charging</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Powerbank ID</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Battery Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Cycles</TableHead>
                <TableHead>Last Charged</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPowerbanks.map((powerbank) => (
                <TableRow key={powerbank.id}>
                  <TableCell className="font-medium">{powerbank.id}</TableCell>
                  <TableCell>{powerbank.serialNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{powerbank.stationName}</TableCell>
                  <TableCell>{powerbank.slotNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBatteryColor(powerbank.batteryLevel)}`}
                          style={{ width: `${powerbank.batteryLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{powerbank.batteryLevel}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(powerbank.status)}>
                      {powerbank.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center space-x-1 ${getHealthColor(powerbank.health)}`}>
                      {getHealthIcon(powerbank.health)}
                      <span className="capitalize">{powerbank.health}</span>
                    </div>
                  </TableCell>
                  <TableCell>{powerbank.totalCycles}</TableCell>
                  <TableCell>{powerbank.lastCharged.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {powerbank.status === 'available' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePopOut(powerbank.id)}
                          className="text-blue-600"
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      )}
                      {powerbank.batteryLevel < 20 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleForceCharge(powerbank.id)}
                          className="text-yellow-600"
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMaintenance(powerbank.id)}
                        className="text-red-600"
                      >
                        <AlertTriangle className="h-4 w-4" />
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