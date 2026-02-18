"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Banknote,
  Users,
  Battery,
  Download,
  RefreshCw,
  User,
  MapPin,
  Star,
} from "lucide-react";
import {
  getOrderStats,
  getDashboardData,
  getAllCustomerAnalytics,
  getCustomerDemographics,
  getMonthlyTrends,
  getStationPerformance,
  getStationPerformanceComparison,
  getTopPerformingStations,
} from "@/lib/api/order";

const COLORS = [
  "#40E0D0",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

// Define proper interfaces based on actual API response
interface ApiDashboardData {
  total_customers?: { overall: number; last_30_days_value: number };
  repeat_customers?: { overall: number; last_30_days_value: number };
  women_percentage?: { overall: number; last_30_days_value: number };
  new_customers?: { overall: number | null; last_30_days_value: number };
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  ongoingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface MonthlyTrend {
  month_number: number;
  month: string;
  revenue: string;
  rentals: number;
}

interface StationPerformance {
  cabinet_id: string;
  name: string;
  location: string;
  partner: string;
  region: string;
  status: string;
  totalSlots: number;
  availableSlots: number;
  revenue: string;
  rentals: number;
  customers: number;
  avg_revenue_per_rental: string;
  utilization_rate: string;
}

interface TopStation {
  cabinet_id: string;
  name: string;
  location: string;
  region: string;
  revenue: string;
  rentals: number;
  unique_customers: number;
  avg_revenue_per_rental: string;
  utilization_rate: string;
}

export default function AnalyticsPage() {
  const { hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [dashboardData, setDashboardData] = useState<ApiDashboardData | null>(
    null,
  );
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<any>(null);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [stationPerformance, setStationPerformance] = useState<
    StationPerformance[]
  >([]);
  const [stationComparison, setStationComparison] = useState<any[]>([]);
  const [topStations, setTopStations] = useState<TopStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  if (!hasPermission(["super_admin", "staff"])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  // Map timeRange to API date parameter
  const getDateParam = () => {
    switch (timeRange) {
      case "7d":
        return "last7days";
      case "30d":
        return "last30days";
      case "3m":
        return "last3months";
      default:
        return "last30days";
    }
  };

  // Helper function to parse string revenue to number
  const parseRevenue = (revenue: string | number): number => {
    if (typeof revenue === "string") {
      return parseFloat(revenue) || 0;
    }
    return revenue || 0;
  };

  // Helper function to parse string percentage to number
  const parsePercentage = (percentage: string | number): number => {
    if (typeof percentage === "string") {
      return parseFloat(percentage) || 0;
    }
    return percentage || 0;
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setRefreshing(true);
      const dateParam = getDateParam();

      const [
        dashboardResponse,
        statsResponse,
        analyticsResponse,
        demographicsResponse,
        monthlyTrendsResponse,
        stationPerformanceResponse,
        topStationsResponse,
      ] = await Promise.all([
        getDashboardData(),
        getOrderStats({ date: dateParam }),
        getAllCustomerAnalytics(),
        getCustomerDemographics(),
        getMonthlyTrends(),
        getStationPerformance(timeRange),
        getTopPerformingStations(5, timeRange),
      ]);

      setDashboardData(dashboardResponse.data);
      setOrderStats(statsResponse.data);
      setCustomerAnalytics(analyticsResponse.data);
      setGenderData(demographicsResponse.data?.customerDashboard || []);
      setMonthlyTrends(monthlyTrendsResponse.data?.monthlyTrends || []);
      setStationPerformance(stationPerformanceResponse.data || []);
      setTopStations(topStationsResponse.data || []);

      // Create station comparison data from station performance
      if (stationPerformanceResponse.data) {
        const comparisonData = stationPerformanceResponse.data.map(
          (station: StationPerformance) => ({
            cabinet_id: station.cabinet_id,
            name: station.name,
            location: station.location,
            region: station.region,
            revenue_7d: parseRevenue(station.revenue),
            rentals_7d: station.rentals,
            revenue_30d: parseRevenue(station.revenue),
            rentals_30d: station.rentals,
            revenue_3m: parseRevenue(station.revenue),
            rentals_3m: station.rentals,
            revenue_total: parseRevenue(station.revenue),
            rentals_total: station.rentals,
            totalSlots: station.totalSlots,
            availableSlots: station.availableSlots,
            current_utilization: parsePercentage(station.utilization_rate),
          }),
        );
        setStationComparison(comparisonData);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Calculate metrics from API data
  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalRentals = orderStats?.totalOrders || 0;
  const totalCustomers =
    dashboardData?.total_customers?.last_30_days_value || 0;
  const repeatCustomers =
    dashboardData?.repeat_customers?.last_30_days_value || 0;
  const womenPercentage =
    dashboardData?.women_percentage?.last_30_days_value || 0;
  const newCustomers = dashboardData?.new_customers?.last_30_days_value || 0;

  // Get current gender data with safe defaults
  const currentGenderData = genderData.find(
    (item: any) => item.metric === "active_customers",
  ) || {
    overall_value: 0,
    last_30_days_value: 0,
    last_3_months_value: 0,
  };

  // Prepare gender data for pie chart (you may need to adjust this based on actual gender data structure)
  const genderChartData = [
    {
      name: "Female",
      value: womenPercentage, // This is a percentage, not actual count
      percentage: womenPercentage,
    },
    {
      name: "Male",
      value: 100 - womenPercentage,
      percentage: 100 - womenPercentage,
    },
  ];

  // Prepare station performance data for charts
  const stationRevenueData = stationPerformance.slice(0, 8).map((station) => ({
    name: station.name.split(" ")[0] || station.cabinet_id,
    revenue: parseRevenue(station.revenue),
    rentals: station.rentals || 0,
    utilization: parsePercentage(station.utilization_rate),
  }));

  // Regional performance data from stations
  const regionalData = stationPerformance.reduce<any[]>((acc, station) => {
    const existingRegion = acc.find((r) => r.region === station.region);

    if (existingRegion) {
      existingRegion.revenue += parseRevenue(station.revenue);
      existingRegion.rentals += station.rentals || 0;
    } else {
      acc.push({
        region: station.region || "Unknown",
        revenue: parseRevenue(station.revenue),
        rentals: station.rentals || 0,
      });
    }

    return acc;
  }, []);

  // Prepare monthly trends data for charts
  const chartMonthlyData = monthlyTrends.map((item) => ({
    month: item.month,
    revenue: parseRevenue(item.revenue),
    rentals: item.rentals,
  }));

  // Utility functions with null safety
  const formatCurrency = (value: number | null | undefined) => {
    const num = value ?? 0;
    return `Ksh.${num.toLocaleString()}`;
  };

  const formatNumber = (num: number | null | undefined) => {
    const value = num ?? 0;
    return value.toLocaleString();
  };

  const formatPercentage = (value: number | null | undefined) => {
    const num = Number(value);
    if (isNaN(num) || value === null || value === undefined) {
      return "0.0%";
    }
    return `${num.toFixed(1)}%`;
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "3m":
        return "Last 3 months";
      default:
        return "Last 30 days";
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time business intelligence and performance metrics
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Revenue
            </CardTitle>
            <Banknote className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs opacity-90">{getTimeRangeLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Battery className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalRentals)}
            </div>
            <p className="text-xs text-gray-600">
              {orderStats?.ongoingOrders || 0} ongoing •{" "}
              {orderStats?.completedOrders || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalCustomers)}
            </div>
            <p className="text-xs text-gray-600">
              {formatNumber(repeatCustomers)} repeat customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(newCustomers)}
            </div>
            <p className="text-xs text-gray-600">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Women Customers
            </CardTitle>
            <User className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(womenPercentage)}
            </div>
            <p className="text-xs text-gray-600">of total customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Station Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend 2025</CardTitle>
            <CardDescription>
              Revenue performance throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `Ksh.${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === "revenue") {
                      return [
                        `Ksh.${Number(value).toLocaleString()}`,
                        "Revenue",
                      ];
                    }
                    return [Number(value).toLocaleString(), "Rentals"];
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#40E0D0"
                  fill="#40E0D0"
                  fillOpacity={0.3}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="rentals"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Rentals"
                  dot={{ fill: "#3b82f6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Stations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Stations</CardTitle>
            <CardDescription>
              Highest revenue generators {getTimeRangeLabel().toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStations.slice(0, 5).map((station, index) => (
                <div
                  key={station.cabinet_id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-600"
                          : index === 1
                            ? "bg-gray-100 text-gray-600"
                            : index === 2
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {index < 3 ? (
                        <Star className="h-4 w-4 fill-current" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {station.name || "Unknown Station"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {station.location || "Location not available"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">
                      {formatCurrency(parseRevenue(station.revenue))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(station.rentals)} rentals
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Station Revenue Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Station Revenue Performance</CardTitle>
            <CardDescription>
              Revenue distribution across top stations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stationRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `Ksh.${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `Ksh.${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#40E0D0" name="Revenue" />
                <Bar dataKey="rentals" fill="#3b82f6" name="Rentals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Revenue distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  // label={(entry) => entry.region}
                >
                  {regionalData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [
                    `Ksh.${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Station Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Station Performance Details</CardTitle>
          <CardDescription>
            Comprehensive performance metrics for all stations
            {stationComparison.length === 0 && " (Showing current period only)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Station</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Region</th>
                  <th className="text-right p-3">Revenue</th>
                  <th className="text-right p-3">Rentals</th>
                  <th className="text-right p-3">Customers</th>
                  <th className="text-right p-3">Avg/Rental</th>
                  <th className="text-right p-3">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {stationPerformance.slice(0, 10).map((station) => (
                  <tr
                    key={station.cabinet_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {station.name || "Unknown"}
                    </td>
                    <td className="p-3">
                      {station.location || "Not available"}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {station.region || "Unknown"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(parseRevenue(station.revenue))}
                    </td>
                    <td className="p-3 text-right">
                      {formatNumber(station.rentals)}
                    </td>
                    <td className="p-3 text-right">
                      {formatNumber(station.customers)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(
                        parseRevenue(station.avg_revenue_per_rental),
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Badge
                        variant={
                          parsePercentage(station.utilization_rate) > 500
                            ? "default"
                            : parsePercentage(station.utilization_rate) > 300
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {formatPercentage(
                          parsePercentage(station.utilization_rate),
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
