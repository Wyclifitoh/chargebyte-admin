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

interface CustomerAnalytics {
  dashboard?: {
    active_customers: {
      overall: number;
      last30Days: number;
    };
    repeat_customers: {
      overall: number;
      last30Days: number;
    };
    new_customers: {
      overall: number | null;
      last30Days: number;
    };
  };
  totalCustomers?: Array<{
    period: string;
    total_customers: number;
  }>;
  repeatCustomers?: Array<{
    period: string;
    repeat_customers: number;
  }>;
  womenPercentage?: Array<{
    period: string;
    total_customers: number;
    female_customers: string;
    female_percentage: string;
  }>;
  demographics?: Array<{
    period: string;
    total_customers: number;
    female_customers: string;
    male_customers: string;
    other_gender: string;
    female_percentage: string;
    male_percentage: string;
    other_percentage: string;
  }>;
  loyalty?: Array<{
    loyalty_segment: string;
    customer_count: number;
    percentage: string;
  }>;
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

interface GenderDemographic {
  period: string;
  total_customers: number;
  female_customers: number;
  male_customers: number;
  other_gender: number;
  female_percentage: number;
  male_percentage: number;
  other_percentage: number;
}

export default function AnalyticsPage() {
  const { hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [dashboardData, setDashboardData] = useState<ApiDashboardData | null>(
    null,
  );
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [customerAnalytics, setCustomerAnalytics] =
    useState<CustomerAnalytics | null>(null);
  const [genderData, setGenderData] = useState<GenderDemographic[]>([]);
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
      console.log("Customer Analytics Raw Data:", analyticsResponse.data);

      // Handle demographics response - it might be nested or direct
      if (
        demographicsResponse.data &&
        Array.isArray(demographicsResponse.data)
      ) {
        setGenderData(demographicsResponse.data);
      } else if (
        demographicsResponse.data?.data &&
        Array.isArray(demographicsResponse.data.data)
      ) {
        setGenderData(demographicsResponse.data.data);
      } else {
        setGenderData([]);
      }

      // Handle monthly trends - check if it's nested
      if (monthlyTrendsResponse.data?.monthlyTrends) {
        setMonthlyTrends(monthlyTrendsResponse.data.monthlyTrends);
      } else if (Array.isArray(monthlyTrendsResponse.data)) {
        setMonthlyTrends(monthlyTrendsResponse.data);
      } else {
        setMonthlyTrends([]);
      }

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

  // Extract customer metrics from the dashboard object
  console.log("Customer Analytics:", customerAnalytics);

  // The data is in customerAnalytics.dashboard
  const dashboardMetrics = customerAnalytics?.dashboard;

  const activeCustomersMetric = dashboardMetrics?.active_customers;
  const repeatCustomersMetric = dashboardMetrics?.repeat_customers;
  const newCustomersMetric = dashboardMetrics?.new_customers;

  console.log("Dashboard Metrics:", dashboardMetrics);
  console.log("Active Customers:", activeCustomersMetric);
  console.log("Repeat Customers:", repeatCustomersMetric);
  console.log("New Customers:", newCustomersMetric);

  // Calculate metrics from API data
  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalRentals = orderStats?.totalOrders || 0;
  const totalCustomers = activeCustomersMetric?.last30Days || 0;
  const repeatCustomers = repeatCustomersMetric?.last30Days || 0;
  const newCustomers = newCustomersMetric?.last30Days || 0;

  console.log("Final values:", {
    totalCustomers,
    repeatCustomers,
    newCustomers,
  });

  // Get women percentage from demographics if available
  // First try to get from customerAnalytics.demographics
  const demographicsData = customerAnalytics?.demographics || [];
  const genderFromAnalytics =
    demographicsData.find((item) => item.period === "Last 30 Days") ||
    demographicsData[0];

  const genderFromState =
    genderData.find((item) => item.period === "Last 30 Days") || genderData[0];

  // Use the one that exists
  const currentGenderData = genderFromAnalytics || genderFromState;

  // Parse string values to numbers for display
  const femalePercentage = currentGenderData
    ? parseFloat(currentGenderData.female_percentage || "0")
    : 0;
  const malePercentage = currentGenderData
    ? parseFloat(currentGenderData.male_percentage || "0")
    : 0;
  const otherPercentage = currentGenderData
    ? parseFloat(currentGenderData.other_percentage || "0")
    : 0;

  const femaleCustomers = currentGenderData
    ? parseInt(currentGenderData.female_customers || "0")
    : 0;
  const maleCustomers = currentGenderData
    ? parseInt(currentGenderData.male_customers || "0")
    : 0;
  const otherCustomers = currentGenderData
    ? parseInt(currentGenderData.other_gender || "0")
    : 0;

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
              {formatPercentage(femalePercentage)}
            </div>
            <p className="text-xs text-gray-600">
              {formatNumber(femaleCustomers)} customers
            </p>
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

      {/* Detailed Gender Analytics */}
      {currentGenderData && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>
              Detailed gender distribution analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg bg-pink-50">
                <div className="text-3xl font-bold text-pink-600 mb-2">
                  {formatPercentage(femalePercentage)}
                </div>
                <div className="text-sm font-medium text-gray-900">Women</div>
                <div className="text-xs text-gray-600">
                  {formatNumber(femaleCustomers)} customers
                </div>
              </div>

              <div className="text-center p-6 border rounded-lg bg-blue-50">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPercentage(malePercentage)}
                </div>
                <div className="text-sm font-medium text-gray-900">Men</div>
                <div className="text-xs text-gray-600">
                  {formatNumber(maleCustomers)} customers
                </div>
              </div>

              <div className="text-center p-6 border rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {formatPercentage(otherPercentage)}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Other/Not Specified
                </div>
                <div className="text-xs text-gray-600">
                  {formatNumber(otherCustomers)} customers
                </div>
              </div>
            </div>

            {/* Gender comparison over time */}
            {genderData.length > 1 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4">
                  Gender Distribution Over Time
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Period</th>
                        <th className="text-left p-2">Total Customers</th>
                        <th className="text-left p-2">Women</th>
                        <th className="text-left p-2">Men</th>
                        <th className="text-left p-2">Other</th>
                      </tr>
                    </thead>
                    <tbody>
                      {genderData.map((periodData, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">
                            {periodData.period}
                          </td>
                          <td className="p-2">
                            {formatNumber(periodData.total_customers)}
                          </td>
                          <td className="p-2">
                            {formatNumber(periodData.female_customers)} (
                            {formatPercentage(periodData.female_percentage)})
                          </td>
                          <td className="p-2">
                            {formatNumber(periodData.male_customers)} (
                            {formatPercentage(periodData.male_percentage)})
                          </td>
                          <td className="p-2">
                            {formatNumber(periodData.other_gender || 0)} (
                            {formatPercentage(periodData.other_percentage || 0)}
                            )
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
      )}

      {/* Customer Loyalty */}
      {customerAnalytics?.loyalty && customerAnalytics.loyalty.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Loyalty Segments</CardTitle>
            <CardDescription>
              Distribution of customers by rental frequency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {customerAnalytics.loyalty.map((segment: any, index: number) => (
                <div
                  key={segment.loyalty_segment || `segment-${index}`}
                  className="text-center p-4 border rounded-lg"
                >
                  <div
                    className={`text-2xl font-bold mb-2`}
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {formatNumber(segment.customer_count)}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {segment.loyalty_segment || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatPercentage(segment.percentage)} of total
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
