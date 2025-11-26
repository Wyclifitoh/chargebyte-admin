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
import { mockStations } from "@/lib/mock-data";
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
  Calendar,
  Download,
  RefreshCw,
  User,
  MapPin,
  Star,
  Activity,
} from "lucide-react";
import {
  getOrders,
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
const GENDER_COLORS = {
  Female: "#ec4899",
  Male: "#3b82f6",
  Other: "#6b7280",
};

interface DashboardData {
  total_customers?: { overall: number; last30Days: number };
  repeat_customers?: { overall: number; last30Days: number };
  women_percentage?: { overall: number; last30Days: number };
  new_customers_30d?: { overall: number | null; last30Days: number };
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

interface GenderData {
  period: string;
  total_customers: number;
  female_customers: number;
  male_customers: number;
  other_gender: number;
  female_percentage: number;
  male_percentage: number;
  other_percentage: number;
}

interface MonthlyTrendData {
  month: string;
  revenue: number;
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
  revenue: number;
  rentals: number;
  customers: number;
  avg_revenue_per_rental: number;
  utilization_rate: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface StationComparison {
  cabinet_id: string;
  name: string;
  location: string;
  region: string;
  revenue_7d: number;
  rentals_7d: number;
  revenue_30d: number;
  rentals_30d: number;
  revenue_3m: number;
  rentals_3m: number;
  revenue_total: number;
  rentals_total: number;
  totalSlots: number;
  availableSlots: number;
  current_utilization: number;
}

type RegionalData = {
  region: string;
  revenue: number;
  rentals: number;
};

export default function AnalyticsPage() {
  const { hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<any>(null);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendData[]>([]);
  const [stationPerformance, setStationPerformance] = useState<
    StationPerformance[]
  >([]);
  const [stationComparison, setStationComparison] = useState<
    StationComparison[]
  >([]);
  const [topStations, setTopStations] = useState<StationPerformance[]>([]);
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
        stationComparisonResponse,
        topStationsResponse,
      ] = await Promise.all([
        getDashboardData(),
        getOrderStats({ date: dateParam }),
        getAllCustomerAnalytics(),
        getCustomerDemographics(),
        getMonthlyTrends(),
        getStationPerformance(timeRange),
        getStationPerformanceComparison(),
        getTopPerformingStations(5, timeRange),
      ]);

      setDashboardData(dashboardResponse.data);
      setOrderStats(statsResponse.data);
      setCustomerAnalytics(analyticsResponse.data);
      setGenderData(demographicsResponse.data || []);
      setMonthlyTrends(monthlyTrendsResponse.data || []);
      setStationPerformance(stationPerformanceResponse.data || []);
      setStationComparison(stationComparisonResponse.data || []);
      setTopStations(topStationsResponse.data || []);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Fallback to mock data if API fails
      setMonthlyTrends([
        { month: "Jan", revenue: 12400, rentals: 890 },
        { month: "Feb", revenue: 15600, rentals: 1120 },
        { month: "Mar", revenue: 18900, rentals: 1350 },
        { month: "Apr", revenue: 22100, rentals: 1580 },
        { month: "May", revenue: 19800, rentals: 1420 },
        { month: "Jun", revenue: 25300, rentals: 1810 },
        { month: "Jul", revenue: 28700, rentals: 2050 },
        { month: "Aug", revenue: 31200, rentals: 2230 },
        { month: "Sep", revenue: 29800, rentals: 2130 },
        { month: "Oct", revenue: 33400, rentals: 2380 },
        { month: "Nov", revenue: 36700, rentals: 2620 },
        { month: "Dec", revenue: 42100, rentals: 3010 },
      ]);
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
  const totalCustomers = dashboardData?.total_customers?.last30Days || 0;
  const repeatCustomers = dashboardData?.repeat_customers?.last30Days || 0;
  const womenPercentage = dashboardData?.women_percentage?.last30Days || 0;
  const newCustomers = dashboardData?.new_customers_30d?.last30Days || 0;

  // Get current gender data
  const currentGenderData =
    genderData.find((item) => item.period === "Last 30 Days") || genderData[0];
  const femalePercentage =
    currentGenderData?.female_percentage || womenPercentage;

  // Prepare gender data for pie chart
  const genderChartData = currentGenderData
    ? [
        {
          name: "Female",
          value: currentGenderData.female_customers,
          percentage: currentGenderData.female_percentage,
        },
        {
          name: "Male",
          value: currentGenderData.male_customers,
          percentage: currentGenderData.male_percentage,
        },
        {
          name: "Other",
          value: currentGenderData.other_gender,
          percentage: currentGenderData.other_percentage,
        },
      ].filter((item) => item.value > 0)
    : [];

  // Prepare station performance data for charts
  const stationRevenueData = stationPerformance.slice(0, 8).map((station) => ({
    name: station.name.split(" ")[0],
    revenue: station.revenue,
    rentals: station.rentals,
    utilization: station.utilization_rate,
  }));

  // Regional performance data from stations

  const regionalData: RegionalData[] = stationPerformance.reduce<
    RegionalData[]
  >((acc, station) => {
    const existingRegion = acc.find((r) => r.region === station.region);

    if (existingRegion) {
      existingRegion.revenue += station.revenue;
      existingRegion.rentals += station.rentals;
    } else {
      acc.push({
        region: station.region,
        revenue: station.revenue,
        rentals: station.rentals,
      });
    }

    return acc;
  }, []);

  const formatCurrency = (value: number) => `Ksh.${value.toLocaleString()}`;
  const formatNumber = (num: number) => num.toLocaleString();

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "0.0%";
    }
    return `${Number(value).toFixed(1)}%`;
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
              {repeatCustomers} repeat customers
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
              {currentGenderData?.female_customers || 0} customers
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
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Ksh.${value / 1000}K`} />
                <Tooltip
                  formatter={(value) => [
                    `Ksh.${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
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
                      <div className="font-medium text-sm">{station.name}</div>
                      <div className="text-xs text-gray-500">
                        {station.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">
                      {formatCurrency(station.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {station.rentals} rentals
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
                <YAxis tickFormatter={(value) => `Ksh.${value / 1000}K`} />
                <Tooltip
                  formatter={(value) => [
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
                  // label={({ region, revenue }) =>
                  //   `${region}: ${formatCurrency(revenue)}`
                  // }
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
                  formatter={(value) => [
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
                  <th className="text-right p-3">7D Revenue</th>
                  <th className="text-right p-3">30D Revenue</th>
                  <th className="text-right p-3">3M Revenue</th>
                  <th className="text-right p-3">Total Rentals</th>
                  <th className="text-right p-3">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {stationComparison.slice(0, 10).map((station) => (
                  <tr
                    key={station.cabinet_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{station.name}</td>
                    <td className="p-3">{station.location}</td>
                    <td className="p-3">
                      <Badge variant="outline">{station.region}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(station.revenue_7d)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(station.revenue_30d)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(station.revenue_3m)}
                    </td>
                    <td className="p-3 text-right">{station.rentals_total}</td>
                    <td className="p-3 text-right">
                      <Badge
                        variant={
                          station.current_utilization > 70
                            ? "default"
                            : station.current_utilization > 40
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {formatPercentage(station.current_utilization)}
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
                  {formatPercentage(currentGenderData.female_percentage)}
                </div>
                <div className="text-sm font-medium text-gray-900">Women</div>
                <div className="text-xs text-gray-600">
                  {currentGenderData.female_customers.toLocaleString()}{" "}
                  customers
                </div>
              </div>

              <div className="text-center p-6 border rounded-lg bg-blue-50">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPercentage(currentGenderData.male_percentage)}
                </div>
                <div className="text-sm font-medium text-gray-900">Men</div>
                <div className="text-xs text-gray-600">
                  {currentGenderData.male_customers.toLocaleString()} customers
                </div>
              </div>

              <div className="text-center p-6 border rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {formatPercentage(currentGenderData.other_percentage)}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Other/Not Specified
                </div>
                <div className="text-xs text-gray-600">
                  {currentGenderData.other_gender.toLocaleString()} customers
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
                            {periodData.total_customers.toLocaleString()}
                          </td>
                          <td className="p-2">
                            {periodData.female_customers.toLocaleString()} (
                            {formatPercentage(periodData.female_percentage)})
                          </td>
                          <td className="p-2">
                            {periodData.male_customers.toLocaleString()} (
                            {formatPercentage(periodData.male_percentage)})
                          </td>
                          <td className="p-2">
                            {periodData.other_gender.toLocaleString()} (
                            {formatPercentage(periodData.other_percentage)})
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
      {customerAnalytics?.loyalty && (
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
                  key={segment.loyalty_segment}
                  className="text-center p-4 border rounded-lg"
                >
                  <div
                    className={`text-2xl font-bold mb-2`}
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {segment.customer_count.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {segment.loyalty_segment}
                  </div>
                  <div className="text-xs text-gray-600">
                    {segment.percentage}% of total
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
