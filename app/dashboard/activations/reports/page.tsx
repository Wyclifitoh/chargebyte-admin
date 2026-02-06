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
import { generateActivationReport, getReportData } from "@/lib/api/activations";

const COUNTIES = [
  "All Counties",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kisii",
];

const STATUS_OPTIONS = [
  "All Status",
  "scheduled",
  "visited",
  "completed",
  "cancelled",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface ReportData {
  countyData: Array<{
    county: string;
    activations: number;
    peopleReached: number;
  }>;
  statusData: Array<{ status: string; count: number }>;
  monthlyData: Array<{ month: string; scheduled: number; visited: number }>;
  summary: {
    totalActivations: number;
    totalPeopleReached: number;
    completionRate: number;
    averagePeoplePerActivation: number;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    county: "All Counties",
    status: "All Status",
    reportType: "summary",
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await getReportData({
        startDate: filters.startDate,
        endDate: filters.endDate,
        county: filters.county !== "All Counties" ? filters.county : undefined,
        status: filters.status !== "All Status" ? filters.status : undefined,
      });
      setReportData(response.data);
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
      const response = await generateActivationReport(filters);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `activation-report-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
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
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={fetchReportData}>Apply Filters</Button>
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
              {reportData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {reportData.summary.totalActivations}
                    </div>
                    <div className="text-sm font-medium">Total Activations</div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {reportData.summary.totalPeopleReached.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium">People Reached</div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {reportData.summary.completionRate}%
                    </div>
                    <div className="text-sm font-medium">Completion Rate</div>
                  </div>

                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {reportData.summary.averagePeoplePerActivation}
                    </div>
                    <div className="text-sm font-medium">
                      Avg. People per Activation
                    </div>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {reportData && (
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
                          <th className="text-left p-3">Avg. per Activation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.countyData.map((county) => (
                          <tr
                            key={county.county}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">{county.county}</td>
                            <td className="p-3">{county.activations}</td>
                            <td className="p-3">
                              {county.peopleReached.toLocaleString()}
                            </td>
                            <td className="p-3">
                              {Math.round(
                                county.peopleReached / county.activations,
                              )}
                            </td>
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
                  <BarChart data={reportData?.countyData.slice(0, 8)}>
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
                      data={reportData?.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData?.statusData.map((entry, index) => (
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
                  <BarChart data={reportData?.monthlyData}>
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
              <div className="space-y-6">
                {/* Export Options */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24"
                    >
                      <FileText className="h-8 w-8 mb-2" />
                      <span>CSV Export</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24"
                    >
                      <Download className="h-8 w-8 mb-2" />
                      <span>Excel Export</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24"
                    >
                      <Printer className="h-8 w-8 mb-2" />
                      <span>PDF Report</span>
                    </Button>
                  </div>
                </div>

                {/* Report Customization */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Customize Report
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Include Columns</Label>
                      <div className="space-y-2">
                        {[
                          "Location Name",
                          "County",
                          "Agent",
                          "Status",
                          "Date",
                          "People Reached",
                          "Contact Info",
                        ].map((col) => (
                          <div
                            key={col}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={col}
                              defaultChecked
                              className="rounded"
                            />
                            <Label htmlFor={col} className="text-sm">
                              {col}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Report Format</Label>
                      <Select defaultValue="detailed">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Email Report</Label>
                      <Input placeholder="Enter email address" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
