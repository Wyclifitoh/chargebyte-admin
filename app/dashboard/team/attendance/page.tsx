'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
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
  UserCheck,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const mockAttendanceData = [
  {
    id: '1',
    name: 'John Kamau',
    date: '2024-02-25',
    checkIn: '08:45 AM',
    checkOut: '05:30 PM',
    status: 'present',
    hoursWorked: 8.75,
    location: 'Nairobi CBD',
  },
  {
    id: '2',
    name: 'Mary Wanjiru',
    date: '2024-02-25',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'present',
    hoursWorked: 9,
    location: 'Westlands',
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    date: '2024-02-25',
    checkIn: '08:30 AM',
    checkOut: '05:00 PM',
    status: 'present',
    hoursWorked: 8.5,
    location: 'Eastleigh',
  },
  {
    id: '4',
    name: 'Grace Muthoni',
    date: '2024-02-25',
    checkIn: '-',
    checkOut: '-',
    status: 'on_leave',
    hoursWorked: 0,
    location: 'Thika',
  },
  {
    id: '5',
    name: 'David Omondi',
    date: '2024-02-25',
    checkIn: '10:30 AM',
    checkOut: '-',
    status: 'late',
    hoursWorked: 0,
    location: 'Karen',
  },
];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'on_leave':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />;
      case 'late':
        return <AlertCircle className="h-4 w-4" />;
      case 'absent':
        return <XCircle className="h-4 w-4" />;
      case 'on_leave':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleMarkAttendance = (memberId: string, status: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.id === memberId
          ? { ...record, status, checkIn: status === 'present' ? new Date().toLocaleTimeString() : '-' }
          : record
      )
    );
    toast.success(`Attendance marked as ${status}`);
  };

  const handleExportAttendance = () => {
    toast.success('Attendance report exported successfully!');
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    present: attendanceRecords.filter(r => r.status === 'present').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    onLeave: attendanceRecords.filter(r => r.status === 'on_leave').length,
    avgHours: (attendanceRecords.reduce((sum, r) => sum + r.hoursWorked, 0) / attendanceRecords.filter(r => r.hoursWorked > 0).length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-gray-600">Monitor team attendance and working hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAttendance}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                <UserCheck className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mark Team Attendance</DialogTitle>
                <DialogDescription>
                  Select team member and mark their attendance status
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {attendanceRecords.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {
                          handleMarkAttendance(member.id, 'present');
                          setIsDialogOpen(false);
                        }}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        onClick={() => {
                          handleMarkAttendance(member.id, 'late');
                          setIsDialogOpen(false);
                        }}
                      >
                        Late
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          handleMarkAttendance(member.id, 'absent');
                          setIsDialogOpen(false);
                        }}
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">On Leave</p>
                <p className="text-2xl font-bold text-blue-600">{stats.onLeave}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Hours</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgHours}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Attendance Records - {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today'}</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
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
                  <TableHead>Team Member</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead className="text-center">Hours Worked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {record.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{record.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{record.location}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${record.checkIn === '-' ? 'text-gray-400' : 'text-gray-900'}`}>
                            {record.checkIn}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${record.checkOut === '-' ? 'text-gray-400' : 'text-gray-900'}`}>
                            {record.checkOut}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {record.hoursWorked > 0 ? `${record.hoursWorked}h` : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(record.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            {record.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast.info('Edit attendance functionality');
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
