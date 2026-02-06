"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Edit,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getActivationStats,
  getRecentActivations,
  getActivationStatsByCounty,
} from "@/lib/api/activations";

interface ActivationStats {
  totalLocations: number;
  locationsVisited: number;
  locationsScheduled: number;
  peopleReached: number;
}

// Update VisitData to include index signature for Recharts compatibility
interface VisitData {
  [key: string]: any; // This allows Recharts to access properties dynamically
  county: string;
  visited: number;
  scheduled: number;
}

interface RecentActivation {
  id: string;
  location_name: string;
  location_type: string;
  notes: string;
  county: string;
  agent_name: string;
  status: string;
  date: string;
  people_reached: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ActivationDashboard() {
  const [stats, setStats] = useState<ActivationStats | null>(null);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [recentActivations, setRecentActivations] = useState<
    RecentActivation[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, recentResponse, countyStatsResponse] =
        await Promise.all([
          getActivationStats(),
          getRecentActivations(),
          getActivationStatsByCounty(),
        ]);

      setStats(statsResponse.data);
      setRecentActivations(recentResponse.data);

      console.log("Recent Activations:", recentResponse.data);

      // Process county stats for charts
      if (countyStatsResponse.data && Array.isArray(countyStatsResponse.data)) {
        const processedData: VisitData[] = countyStatsResponse.data.map(
          (county: any) => ({
            county: county.county,
            visited: county.visited_count || 0,
            scheduled: county.scheduled_count || 0,
            total: county.total_activations || 0,
          }),
        );
        setVisitData(processedData);
      } else {
        // Fallback mock data if API doesn't return expected format
        setVisitData([
          { county: "Nairobi", visited: 45, scheduled: 60 },
          { county: "Mombasa", visited: 38, scheduled: 50 },
          { county: "Kisumu", visited: 25, scheduled: 40 },
          { county: "Nakuru", visited: 32, scheduled: 45 },
          { county: "Eldoret", visited: 28, scheduled: 35 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to mock data on error
      setVisitData([
        { county: "Nairobi", visited: 45, scheduled: 60 },
        { county: "Mombasa", visited: 38, scheduled: 50 },
        { county: "Kisumu", visited: 25, scheduled: 40 },
        { county: "Nakuru", visited: 32, scheduled: 45 },
        { county: "Eldoret", visited: 28, scheduled: 35 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "visited":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Visited
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Activation Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor activation progress across all locations
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={fetchDashboardData}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Locations
            </CardTitle>
            <MapPin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalLocations || 0}
            </div>
            <p className="text-xs text-gray-500">All registered locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Locations Visited
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.locationsVisited || 0}
            </div>
            <p className="text-xs text-gray-500">
              {Math.round(
                ((stats?.locationsVisited || 0) /
                  (stats?.totalLocations || 1)) *
                  100,
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.locationsScheduled || 0}
            </div>
            <p className="text-xs text-gray-500">Awaiting activation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              People Reached
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.peopleReached?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500">Total people engaged</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visited vs Scheduled Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visited vs Scheduled by County</CardTitle>
            <p className="text-sm text-gray-500">
              Comparison of completed vs planned activations
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="county" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visited" fill="#0088FE" name="Visited" />
                <Bar dataKey="scheduled" fill="#00C49F" name="Scheduled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visits per County Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visits Distribution by County</CardTitle>
            <p className="text-sm text-gray-500">
              Percentage of visits across counties
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={visitData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ county, visited }) => `${county}: ${visited}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visited"
                >
                  {visitData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Visits"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activations</CardTitle>
          <p className="text-sm text-gray-500">Last 10 activation activities</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>People Reached</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivations.map((activation) => (
                  <TableRow key={activation.id}>
                    <TableCell className="font-medium">
                      {activation.location_name}
                    </TableCell>
                    <TableCell>{activation.county}</TableCell>
                    <TableCell>{activation.agent_name}</TableCell>
                    <TableCell>{getStatusBadge(activation.status)}</TableCell>
                    <TableCell>
                      {new Date(activation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {activation.people_reached.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
