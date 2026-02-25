'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {record.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.name}</h4>
                          <p className="text-sm text-gray-600">{record.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{record.checkIn}</span>
                            <span>-</span>
                            <span>{record.checkOut}</span>
                          </div>
                          {record.hoursWorked > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {record.hoursWorked} hours worked
                            </p>
                          )}
                        </div>

                        <Badge variant="outline" className={getStatusColor(record.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            {record.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
