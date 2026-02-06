// app/(dashboard)/activations/reports/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Printer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import {
  generateActivationReport,
  getActivationReportData,
  getActivationStatsByCounty,
  getActivationMonthlyTrends,
  getActivationStatsByLocationType,
} from "@/lib/api/activations";

const COUNTIES = [
  "All Counties",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kisii",
  "Murang'a",
  "Nyeri",
  "Kericho",
  "Narok",
  "Meru",
  "Isiolo",
];

const STATUS_OPTIONS = ["All Status", "Visited", "Scheduled", "Cancelled"];

const LOCATION_TYPES = ["School", "Market", "Institution"];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Helper function to process county data
const processCountyData = (countyStats: any[]) => {
  return countyStats.map((stat) => ({
    county: stat.county,
    activations: stat.total_activations,
    peopleReached: stat.people_reached || 0,
    visited: stat.visited_count || 0,
    scheduled: stat.scheduled_count || 0,
  }));
};

// Helper function to process status data
const processStatusData = (reportData: any) => {
  if (!reportData?.report_data) return [];

  const statusCount: Record<string, number> = {};
  reportData.report_data.forEach((item: any) => {
    const status = item.status;
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  return Object.entries(statusCount).map(([status, count]) => ({
    status,
    count,
  }));
};

// Helper function to process monthly data
const processMonthlyData = (monthlyTrends: any[]) => {
  return monthlyTrends.map((trend) => ({
    month: trend.month,
    scheduled: trend.scheduled_count || 0,
    visited: trend.visited_count || 0,
  }));
};

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [countyData, setCountyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    county: "All Counties",
    status: "All Status",
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [reportResponse, countyResponse, monthlyResponse] =
        await Promise.all([
          getActivationReportData({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            county:
              filters.county !== "All Counties" ? filters.county : undefined,
            status:
              filters.status !== "All Status" ? filters.status : undefined,
          }),
          getActivationStatsByCounty(),
          getActivationMonthlyTrends(),
        ]);

      // Process the data
      const reportData = reportResponse.data;
      const countyStats = countyResponse.data;
      const monthlyTrends = monthlyResponse.data;

      setReportData(reportData);
      setCountyData(processCountyData(countyStats));
      setStatusData(processStatusData(reportData));
      setMonthlyData(processMonthlyData(monthlyTrends));

      // Calculate summary from report data
      if (reportData?.summary) {
        const summaryData = reportData.summary;
        setSummary({
          totalActivations: summaryData.total_activations,
          totalPeopleReached: summaryData.total_people_reached,
          completionRate:
            summaryData.visited_count > 0
              ? Math.round(
                  (summaryData.visited_count / summaryData.total_activations) *
                    100,
                )
              : 0,
          averagePeoplePerActivation:
            summaryData.total_people_reached > 0
              ? Math.round(
                  summaryData.total_people_reached /
                    summaryData.total_activations,
                )
              : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      await generateActivationReport(filters);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleApplyFilters = () => {
    fetchReportData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
          <p className="text-gray-600 mt-1">
            Generate detailed reports and export data
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button onClick={handleGenerateReport} disabled={generating}>
            <Download className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Export Report"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* County Filter */}
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Select
                value={filters.county}
                onValueChange={(value) => handleFilterChange("county", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTIES.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Type Tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-auto">
          <TabsTrigger value="summary" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Detailed
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {summary.totalActivations}
                    </div>
                    <div className="text-sm font-medium">Total Activations</div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {summary.totalPeopleReached.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium">People Reached</div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {summary.completionRate}%
                    </div>
                    <div className="text-sm font-medium">Completion Rate</div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {summary.averagePeoplePerActivation}
                    </div>
                    <div className="text-sm font-medium">
                      Avg. People per Activation
                    </div>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {countyData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    County-wise Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">County</th>
                          <th className="text-left p-3">Activations</th>
                          <th className="text-left p-3">People Reached</th>
                          <th className="text-left p-3">Visited</th>
                          <th className="text-left p-3">Scheduled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countyData.map((county) => (
                          <tr
                            key={county.county}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">{county.county}</td>
                            <td className="p-3">{county.activations}</td>
                            <td className="p-3">
                              {county.peopleReached.toLocaleString()}
                            </td>
                            <td className="p-3">{county.visited}</td>
                            <td className="p-3">{county.scheduled}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* County Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activations by County</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countyData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="activations"
                      fill="#0088FE"
                      name="Activations"
                    />
                    <Bar
                      dataKey="peopleReached"
                      fill="#00C49F"
                      name="People Reached"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Activation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scheduled" fill="#FFBB28" name="Scheduled" />
                    <Bar dataKey="visited" fill="#00C49F" name="Visited" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Tab */}
        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData?.report_data && reportData.report_data.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Activation Records ({reportData.report_data.length} total)
                    </h3>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Location</th>
                          <th className="text-left p-3">County</th>
                          <th className="text-left p-3">Type</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">People Reached</th>
                          <th className="text-left p-3">Agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.report_data
                          .slice(0, 20)
                          .map((item: any) => (
                            <tr
                              key={item.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 font-medium">
                                {item.location_name}
                              </td>
                              <td className="p-3">{item.county}</td>
                              <td className="p-3">{item.location_type}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    item.status === "Visited"
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "Scheduled"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-3">{item.visit_date}</td>
                              <td className="p-3">{item.people_reached}</td>
                              <td className="p-3">
                                {item.agent_name || "N/A"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No activation data found for the selected filters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
