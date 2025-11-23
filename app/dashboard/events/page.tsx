'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  MapPin,
  Users,
  Banknote,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  Download,
  Filter,
  Battery
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  type: 'vendor_paid' | 'organizer_paid' | 'free_attendance';
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  organizer: string;
  startDate: string;
  endDate: string;
  expectedAttendees: number;
  machinesAllocated: number;
  revenue?: number;
  cost?: number;
  description: string;
  contactPerson: string;
  contactPhone: string;
  transportCost?: number;
  setupCost?: number;
}

const mockEvents: Event[] = [
  // Completed Events
  {
    id: 'EVT001',
    name: 'Nairobi Tech Festival 2024',
    type: 'organizer_paid',
    status: 'completed',
    location: 'Kenyatta International Convention Centre',
    organizer: 'Tech Society Kenya',
    startDate: '2024-11-15',
    endDate: '2024-11-17',
    expectedAttendees: 5000,
    machinesAllocated: 25,
    revenue: 250000,
    cost: 45000,
    description: 'Annual technology conference featuring startups, innovators, and tech enthusiasts. Power banks provided for all attendees.',
    contactPerson: 'Sarah Kimani',
    contactPhone: '+254 712 345 678',
    transportCost: 15000,
    setupCost: 8000
  },
  {
    id: 'EVT002',
    name: 'Koroga Festival November Edition',
    type: 'vendor_paid',
    status: 'completed',
    location: 'Kasarani Stadium',
    organizer: 'Homeboyz Entertainment',
    startDate: '2024-11-11',
    endDate: '2024-11-11',
    expectedAttendees: 8000,
    machinesAllocated: 30,
    revenue: 240000,
    cost: 20000,
    description: 'Music and food festival featuring local artists and international acts. Charging services offered to attendees.',
    contactPerson: 'Mike Otieno',
    contactPhone: '+254 723 456 789',
    transportCost: 12000
  },
  {
    id: 'EVT003',
    name: 'Nairobi Fashion Week',
    type: 'organizer_paid',
    status: 'completed',
    location: 'The Village Market',
    organizer: 'Fashion Council Kenya',
    startDate: '2024-11-08',
    endDate: '2024-11-10',
    expectedAttendees: 3000,
    machinesAllocated: 20,
    revenue: 180000,
    cost: 35000,
    description: 'Premier fashion event showcasing African designers and models.',
    contactPerson: 'Grace Wanjiku',
    contactPhone: '+254 734 567 890',
    transportCost: 10000,
    setupCost: 5000
  },
  {
    id: 'EVT004',
    name: 'Safari Sevens Rugby Tournament',
    type: 'vendor_paid',
    status: 'completed',
    location: 'RFUEA Grounds',
    organizer: 'Kenya Rugby Union',
    startDate: '2024-11-02',
    endDate: '2024-11-03',
    expectedAttendees: 12000,
    machinesAllocated: 40,
    revenue: 360000,
    cost: 28000,
    description: 'International rugby 7s tournament with teams from across Africa.',
    contactPerson: 'James Mwangi',
    contactPhone: '+254 745 678 901',
    transportCost: 18000
  },

  // Upcoming Events
  {
    id: 'EVT005',
    name: 'Blankets and Wine December Edition',
    type: 'vendor_paid',
    status: 'upcoming',
    location: 'Carnivore Gardens',
    organizer: 'MTV Base Africa',
    startDate: '2024-12-01',
    endDate: '2024-12-01',
    expectedAttendees: 6000,
    machinesAllocated: 35,
    description: 'Monthly music experience featuring the best of African music in a picnic-style setting.',
    contactPerson: 'Lisa Akinyi',
    contactPhone: '+254 756 789 012'
  },
  {
    id: 'EVT006',
    name: 'Jamhuri Day Celebrations',
    type: 'organizer_paid',
    status: 'upcoming',
    location: 'Nyayo National Stadium',
    organizer: 'Government of Kenya',
    startDate: '2024-12-12',
    endDate: '2024-12-12',
    expectedAttendees: 20000,
    machinesAllocated: 50,
    revenue: 400000,
    cost: 75000,
    description: 'National celebrations marking Kenya\'s independence. Power banks provided for government officials and guests.',
    contactPerson: 'John Kamau',
    contactPhone: '+254 767 890 123',
    transportCost: 25000,
    setupCost: 15000
  },
  {
    id: 'EVT007',
    name: 'Nairobi International Trade Fair',
    type: 'vendor_paid',
    status: 'upcoming',
    location: 'Jamhuri Park',
    organizer: 'Agricultural Society of Kenya',
    startDate: '2024-12-15',
    endDate: '2024-12-22',
    expectedAttendees: 15000,
    machinesAllocated: 45,
    description: 'Annual agricultural show featuring exhibitors from across East Africa.',
    contactPerson: 'Mary Wambui',
    contactPhone: '+254 778 901 234'
  },
  {
    id: 'EVT008',
    name: 'Christmas Festival Nairobi',
    type: 'free_attendance',
    status: 'upcoming',
    location: 'Uhuru Park',
    organizer: 'Nairobi County Government',
    startDate: '2024-12-24',
    endDate: '2024-12-26',
    expectedAttendees: 25000,
    machinesAllocated: 60,
    cost: 120000,
    description: 'Free public Christmas celebrations with music, food, and family activities. Free charging services for attendees.',
    contactPerson: 'David Ochieng',
    contactPhone: '+254 789 012 345',
    transportCost: 30000,
    setupCost: 20000
  }
];

const eventTypeConfig = {
  vendor_paid: {
    label: 'Vendor Paid',
    description: 'We pay to attend as vendors, charge attendees Ksh.100/hour',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  organizer_paid: {
    label: 'Organizer Paid',
    description: 'Event organizers pay us, we provide machines for their use',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  free_attendance: {
    label: 'Free Attendance',
    description: 'We provide free charging services, sponsored by organizers',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
};

const statusConfig = {
  upcoming: {
    label: 'Upcoming',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200'
  }
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredEvents = mockEvents.filter(event => {
    const statusMatch = event.status === activeTab;
    const typeMatch = selectedType === 'all' || event.type === selectedType;
    return statusMatch && typeMatch;
  });

  const totalRevenue = mockEvents
    .filter(event => event.status === 'completed' && event.revenue)
    .reduce((sum, event) => sum + (event.revenue || 0), 0);

  const totalCost = mockEvents
    .filter(event => event.status === 'completed' && event.cost)
    .reduce((sum, event) => sum + (event.cost || 0), 0);

  const netProfit = totalRevenue - totalCost;

  const formatCurrency = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">Manage event partnerships and charging services</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-gray-600">
              {mockEvents.filter(e => e.status === 'upcoming').length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-600">From completed events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Banknote className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
            <p className="text-xs text-gray-600">After costs and expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Machines Deployed</CardTitle>
            <Battery className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEvents.reduce((sum, event) => sum + event.machinesAllocated, 0)}
            </div>
            <p className="text-xs text-gray-600">Across all events</p>
          </CardContent>
        </Card>
      </div>

      {/* Event Type Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Event Partnership Models</CardTitle>
          <CardDescription>Different ways we partner with event organizers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(eventTypeConfig).map(([type, config]) => (
              <div key={type} className="border rounded-lg p-4">
                <Badge className={`mb-2 ${config.color}`}>
                  {config.label}
                </Badge>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage and track all event partnerships</CardDescription>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="vendor_paid">Vendor Paid</option>
                <option value="organizer_paid">Organizer Paid</option>
                <option value="free_attendance">Free Attendance</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({mockEvents.filter(e => e.status === 'upcoming').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({mockEvents.filter(e => e.status === 'completed').length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({mockEvents.filter(e => e.status === 'cancelled').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-500">No events match your current filters.</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {event.name}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge className={statusConfig[event.status].color}>
                                  {statusConfig[event.status].label}
                                </Badge>
                                <Badge className={eventTypeConfig[event.type].color}>
                                  {eventTypeConfig[event.type].label}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{event.organizer}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{event.expectedAttendees.toLocaleString()} attendees</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600">{event.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            <div>
                              <span className="text-xs text-gray-500">Machines:</span>
                              <p className="font-medium">{event.machinesAllocated} units</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Contact:</span>
                              <p className="font-medium">{event.contactPerson}</p>
                              <p className="text-xs text-gray-600">{event.contactPhone}</p>
                            </div>
                            {event.revenue && (
                              <div>
                                <span className="text-xs text-gray-500">Revenue:</span>
                                <p className="font-medium text-green-600">
                                  {formatCurrency(event.revenue)}
                                </p>
                              </div>
                            )}
                            {event.cost && (
                              <div>
                                <span className="text-xs text-gray-500">Cost:</span>
                                <p className="font-medium text-red-600">
                                  {formatCurrency(event.cost)}
                                </p>
                              </div>
                            )}
                          </div>

                          {event.transportCost && (
                            <div className="flex space-x-4 text-xs text-gray-500">
                              <span>Transport: {formatCurrency(event.transportCost)}</span>
                              {event.setupCost && (
                                <span>Setup: {formatCurrency(event.setupCost)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}