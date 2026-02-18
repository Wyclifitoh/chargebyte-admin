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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import {
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
  Line,
  LineChart,
} from "recharts";
import {
  TrendingUp,
  Banknote,
  Users,
  Battery,
  Download,
  RefreshCw,
  User,
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import api from "@/lib/api";

const COLORS = [
  "#40E0D0",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

// Interfaces
interface DashboardStats {
  unique_customers: number;
  total_rentals: number;
  total_revenue_kes: string | number;
  total_revenue_usd: string | number;
  avg_order_value: string | number;
  total_minutes: string | number;
  ongoing_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

interface MonthlyData {
  month_key: string;
  month_name: string;
  total_rentals: number;
  unique_customers: number;
  revenue_kes: string | number;
  revenue_usd: string | number;
  total_minutes: string | number;
  avg_order_value: string | number;
  target_usd: number | null;
}

interface WeeklyData {
  year: number;
  week_number: number;
  week_start: string;
  week_end: string;
  total_rentals: number;
  unique_customers: number;
  revenue_kes: string | number;
  revenue_usd: string | number;
  total_minutes: string | number;
  week_display: string;
}

interface DailyData {
  date: string;
  day_name: string;
  day_of_week: number;
  total_rentals: number;
  unique_customers: number;
  revenue_kes: string | number;
  revenue_usd: string | number;
  total_minutes: string | number;
  avg_order_value: string | number;
  peak_hour: number;
}

interface HourlyData {
  hour_of_day: number;
  order_count: number;
  avg_rental_minutes: string | number;
  avg_amount: string | number;
  total_revenue: string | number;
  percentage: string | number;
}

interface BestDayData {
  day_name: string;
  total_rentals: number;
  total_revenue_kes: string | number;
  total_revenue_usd: string | number;
  avg_order_value: string | number;
  unique_customers: number;
  revenue_rank: number;
  volume_rank: number;
}

interface GenderData {
  gender: string;
  customer_count: number;
  rental_count: number;
  revenue_kes: string | number;
  revenue_usd: string | number;
  customer_percentage: string | number;
  revenue_percentage: string | number;
}

export default function AnalyticsPage() {
  const { hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState("last4months");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [viewMode, setViewMode] = useState("monthly");

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [bestDaysData, setBestDaysData] = useState<BestDayData[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);

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

  // Helper functions to parse string values from API
  const parseNumber = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value;
  };

  const formatCurrency = (
    value: string | number | null | undefined,
  ): string => {
    const num = parseNumber(value);
    return `Ksh ${num.toLocaleString()}`;
  };

  const formatUSD = (value: string | number | null | undefined): string => {
    const num = parseNumber(value);
    return `$${num.toLocaleString()}`;
  };

  const formatNumber = (value: string | number | null | undefined): string => {
    const num = parseNumber(value);
    return num.toLocaleString();
  };

  const formatPercentage = (
    value: string | number | null | undefined,
  ): string => {
    const num = parseNumber(value);
    return `${num.toFixed(1)}%`;
  };

  // Fetch all analytics data
  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // setError(null);

      // Build query params
      let params = new URLSearchParams();
      params.append("dateRange", timeRange);

      console.log("🔍 DEBUG - Fetching with params:", {
        timeRange,
        selectedMonth,
        selectedWeek,
        params: params.toString(),
      });

      const [
        statsRes,
        monthlyRes,
        weeklyRes,
        dailyRes,
        hourlyRes,
        bestDaysRes,
        genderRes,
      ] = await Promise.all([
        api.get(`/customer-analytics/dashboard-stats?${params}`),
        api.get("/customer-analytics/revenue-by-month"),
        api.get(`/customer-analytics/revenue-by-week?${params}`),
        api.get(`/customer-analytics/revenue-by-day?${params}`),
        api.get(
          `/customer-analytics/hourly-distribution?dateRange=${timeRange}`,
        ),
        api.get("/customer-analytics/best-performing-days"),
        api.get(
          `/customer-analytics/gender-distribution?dateRange=${timeRange}`,
        ),
      ]);

      // Log each response structure
      console.log("📊 DEBUG - Stats Response:", {
        status: statsRes.status,
        data: statsRes.data,
        hasData: !!statsRes.data,
        dataType: typeof statsRes.data,
        keys: Object.keys(statsRes.data || {}),
      });

      console.log("📊 DEBUG - Monthly Response:", {
        status: monthlyRes.status,
        data: monthlyRes.data,
        hasData: !!monthlyRes.data,
        dataType: typeof monthlyRes.data,
        keys: Object.keys(monthlyRes.data || {}),
      });

      console.log("📊 DEBUG - Weekly Response:", {
        status: weeklyRes.status,
        data: weeklyRes.data,
        hasData: !!weeklyRes.data,
        dataType: typeof weeklyRes.data,
        keys: Object.keys(weeklyRes.data || {}),
      });

      console.log("📊 DEBUG - Daily Response:", {
        status: dailyRes.status,
        data: dailyRes.data,
        hasData: !!dailyRes.data,
        dataType: typeof dailyRes.data,
        keys: Object.keys(dailyRes.data || {}),
      });

      console.log("📊 DEBUG - Hourly Response:", {
        status: hourlyRes.status,
        data: hourlyRes.data,
        hasData: !!hourlyRes.data,
        dataType: typeof hourlyRes.data,
        keys: Object.keys(hourlyRes.data || {}),
      });

      console.log("📊 DEBUG - Best Days Response:", {
        status: bestDaysRes.status,
        data: bestDaysRes.data,
        hasData: !!bestDaysRes.data,
        dataType: typeof bestDaysRes.data,
        keys: Object.keys(bestDaysRes.data || {}),
      });

      console.log("📊 DEBUG - Gender Response:", {
        status: genderRes.status,
        data: genderRes.data,
        hasData: !!genderRes.data,
        dataType: typeof genderRes.data,
        keys: Object.keys(genderRes.data || {}),
      });

      // Check if data exists and set it
      if (statsRes.data) {
        // Check different possible paths
        const statsData = statsRes.data.data || statsRes.data;
        console.log("✅ DEBUG - Setting dashboard stats:", statsData);
        setDashboardStats(statsData);
      } else {
        console.warn("⚠️ DEBUG - No dashboard stats data received");
      }

      if (monthlyRes.data) {
        const monthlyData = monthlyRes.data.data || monthlyRes.data;
        console.log("✅ DEBUG - Setting monthly data:", monthlyData);
        setMonthlyData(Array.isArray(monthlyData) ? monthlyData : []);
      } else {
        console.warn("⚠️ DEBUG - No monthly data received");
      }

      if (weeklyRes.data) {
        const weeklyData = weeklyRes.data.data || weeklyRes.data;
        console.log("✅ DEBUG - Setting weekly data:", weeklyData);
        setWeeklyData(Array.isArray(weeklyData) ? weeklyData : []);
      } else {
        console.warn("⚠️ DEBUG - No weekly data received");
      }

      if (dailyRes.data) {
        const dailyData = dailyRes.data.data || dailyRes.data;
        console.log("✅ DEBUG - Setting daily data:", dailyData);
        setDailyData(Array.isArray(dailyData) ? dailyData : []);
      } else {
        console.warn("⚠️ DEBUG - No daily data received");
      }

      if (hourlyRes.data) {
        const hourlyData = hourlyRes.data.data || hourlyRes.data;
        console.log("✅ DEBUG - Setting hourly data:", hourlyData);
        setHourlyData(Array.isArray(hourlyData) ? hourlyData : []);
      } else {
        console.warn("⚠️ DEBUG - No hourly data received");
      }

      if (bestDaysRes.data) {
        const bestDaysData = bestDaysRes.data.data || bestDaysRes.data;
        console.log("✅ DEBUG - Setting best days data:", bestDaysData);
        setBestDaysData(Array.isArray(bestDaysData) ? bestDaysData : []);
      } else {
        console.warn("⚠️ DEBUG - No best days data received");
      }

      if (genderRes.data) {
        const genderData = genderRes.data.data || genderRes.data;
        console.log("✅ DEBUG - Setting gender data:", genderData);
        setGenderData(Array.isArray(genderData) ? genderData : []);
      } else {
        console.warn("⚠️ DEBUG - No gender data received");
      }
    } catch (error) {
      console.error("❌ DEBUG - Error fetching analytics data:", error);
      // setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedMonth, selectedWeek]);

  // Get unique months for filter
  const monthOptions = monthlyData.map((item) => ({
    value: item.month_key,
    label: item.month_name,
  }));

  // Get weeks for selected month
  const weekOptions = weeklyData
    .filter((week) => {
      if (!selectedMonth || selectedMonth === "all") return true;
      const weekYearMonth = `${week.year}-${String(week.week_number).padStart(2, "0")}`;
      return weekYearMonth.startsWith(selectedMonth);
    })
    .map((week) => ({
      value: week.week_number.toString(),
      label: week.week_display,
    }));

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track performance by month, week, and day
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last3months">Last 3 months</SelectItem>
              <SelectItem value="last4months">Last 4 months</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === "weekly" && (
            <>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Weeks</SelectItem>
                  {weekOptions.map((week) => (
                    <SelectItem key={week.value} value={week.value}>
                      {week.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

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

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
        <TabsList>
          <TabsTrigger value="monthly" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Monthly View
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Weekly View
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Daily View
          </TabsTrigger>
        </TabsList>

        {/* Key Metrics Cards */}
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
                {formatCurrency(dashboardStats?.total_revenue_kes)}
              </div>
              <div className="text-xs opacity-90">
                {formatUSD(dashboardStats?.total_revenue_usd)} USD
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rentals
              </CardTitle>
              <Battery className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(dashboardStats?.total_rentals)}
              </div>
              <p className="text-xs text-gray-600">
                {dashboardStats?.ongoing_orders || 0} ongoing •{" "}
                {dashboardStats?.completed_orders || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Customers
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(dashboardStats?.unique_customers)}
              </div>
              <p className="text-xs text-gray-600">Active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Order Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboardStats?.avg_order_value)}
              </div>
              <p className="text-xs text-gray-600">Per rental</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Minutes
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(dashboardStats?.total_minutes)}
              </div>
              <p className="text-xs text-gray-600">
                {Math.round(parseNumber(dashboardStats?.total_minutes) / 60)}{" "}
                hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly View */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue & Rentals</CardTitle>
              <CardDescription>
                Performance by month (Nov 2025 - Feb 2026)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) =>
                      `Ksh ${(value / 1000).toFixed(0)}K`
                    }
                  />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "revenue_kes")
                        return [
                          `Ksh ${parseNumber(value).toLocaleString()}`,
                          "Revenue",
                        ];
                      if (name === "revenue_usd")
                        return [
                          `$${parseNumber(value).toLocaleString()}`,
                          "Revenue (USD)",
                        ];
                      if (name === "target_usd")
                        return [
                          `$${parseNumber(value).toLocaleString()}`,
                          "Target (USD)",
                        ];
                      return [parseNumber(value).toLocaleString(), "Rentals"];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue_kes"
                    fill="#40E0D0"
                    name="Revenue (KES)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="total_rentals"
                    fill="#3b82f6"
                    name="Rentals"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="target_usd"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Target (USD)"
                    dot={{ fill: "#ef4444" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>
                Detailed monthly performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Month</th>
                      <th className="text-right p-3">Rentals</th>
                      <th className="text-right p-3">Customers</th>
                      <th className="text-right p-3">Revenue (KES)</th>
                      <th className="text-right p-3">Revenue (USD)</th>
                      {/* <th className="text-right p-3">Target (USD)</th> */}
                      {/* <th className="text-right p-3">Variance</th> */}
                      {/* <th className="text-right p-3">% of Target</th> */}
                      <th className="text-right p-3">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((month) => {
                      const revenue_usd = parseNumber(month.revenue_usd);
                      const target_usd = month.target_usd || 0;
                      const variance = revenue_usd - target_usd;
                      const percentOfTarget = target_usd
                        ? ((revenue_usd / target_usd) * 100).toFixed(1)
                        : "N/A";

                      return (
                        <tr
                          key={month.month_key}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3 font-medium">
                            {month.month_name}
                          </td>
                          <td className="p-3 text-right">
                            {formatNumber(month.total_rentals)}
                          </td>
                          <td className="p-3 text-right">
                            {formatNumber(month.unique_customers)}
                          </td>
                          <td className="p-3 text-right">
                            {formatCurrency(month.revenue_kes)}
                          </td>
                          <td className="p-3 text-right">
                            {formatUSD(month.revenue_usd)}
                          </td>
                          {/* <td className="p-3 text-right">
                            {formatUSD(month.target_usd)}
                          </td> */}
                          {/* <td className="p-3 text-right">
                            <span
                              className={
                                variance >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {variance >= 0 ? "+" : ""}
                              {formatUSD(variance)}
                            </span>
                          </td> */}
                          {/* <td className="p-3 text-right">
                            <Badge
                              variant={
                                parseFloat(percentOfTarget) >= 100
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {percentOfTarget}%
                            </Badge>
                          </td> */}
                          <td className="p-3 text-right">
                            {formatCurrency(month.avg_order_value)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly View */}
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Revenue and rentals by week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week_display"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "revenue_usd")
                        return [
                          `$${parseNumber(value).toLocaleString()}`,
                          "Revenue",
                        ];
                      if (name === "total_rentals")
                        return [parseNumber(value).toLocaleString(), "Rentals"];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue_usd"
                    stroke="#40E0D0"
                    name="Revenue (USD)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total_rentals"
                    stroke="#3b82f6"
                    name="Rentals"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Breakdown</CardTitle>
              <CardDescription>Performance metrics by week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Week</th>
                      <th className="text-right p-3">Rentals</th>
                      <th className="text-right p-3">Customers</th>
                      <th className="text-right p-3">Revenue (KES)</th>
                      <th className="text-right p-3">Revenue (USD)</th>
                      <th className="text-right p-3">Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyData.map((week) => (
                      <tr
                        key={`${week.year}-${week.week_number}`}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">{week.week_display}</td>
                        <td className="p-3 text-right">
                          {formatNumber(week.total_rentals)}
                        </td>
                        <td className="p-3 text-right">
                          {formatNumber(week.unique_customers)}
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(week.revenue_kes)}
                        </td>
                        <td className="p-3 text-right">
                          {formatUSD(week.revenue_usd)}
                        </td>
                        <td className="p-3 text-right">
                          {formatNumber(week.total_minutes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily View */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Revenue and rentals by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyData.slice(0, 30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "revenue_usd")
                        return [
                          `$${parseNumber(value).toLocaleString()}`,
                          "Revenue",
                        ];
                      if (name === "total_rentals")
                        return [parseNumber(value).toLocaleString(), "Rentals"];
                      return [value, name];
                    }}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue_usd"
                    fill="#40E0D0"
                    name="Revenue (USD)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="total_rentals"
                    fill="#3b82f6"
                    name="Rentals"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Performing Days of Week</CardTitle>
              <CardDescription>Average performance by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">By Revenue</h3>
                  <div className="space-y-3">
                    {bestDaysData
                      .sort(
                        (a, b) =>
                          parseNumber(b.total_revenue_usd) -
                          parseNumber(a.total_revenue_usd),
                      )
                      .slice(0, 3)
                      .map((day, index) => (
                        <div
                          key={day.day_name}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Award
                              className={`h-5 w-5 ${
                                index === 0
                                  ? "text-yellow-500"
                                  : index === 1
                                    ? "text-gray-400"
                                    : "text-orange-400"
                              }`}
                            />
                            <span className="font-medium">{day.day_name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatUSD(day.total_revenue_usd)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatNumber(day.total_rentals)} rentals
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">By Volume</h3>
                  <div className="space-y-3">
                    {bestDaysData
                      .sort((a, b) => b.total_rentals - a.total_rentals)
                      .slice(0, 3)
                      .map((day, index) => (
                        <div
                          key={day.day_name}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Award
                              className={`h-5 w-5 ${
                                index === 0
                                  ? "text-yellow-500"
                                  : index === 1
                                    ? "text-gray-400"
                                    : "text-orange-400"
                              }`}
                            />
                            <span className="font-medium">{day.day_name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatNumber(day.total_rentals)} rentals
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatUSD(day.total_revenue_usd)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Breakdown</CardTitle>
              <CardDescription>Performance metrics by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Day</th>
                      <th className="text-right p-3">Rentals</th>
                      <th className="text-right p-3">Customers</th>
                      <th className="text-right p-3">Revenue (KES)</th>
                      <th className="text-right p-3">Revenue (USD)</th>
                      <th className="text-right p-3">Avg Order</th>
                      <th className="text-right p-3">Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((day) => (
                      <tr key={day.date} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{day.day_name}</Badge>
                        </td>
                        <td className="p-3 text-right">
                          {formatNumber(day.total_rentals)}
                        </td>
                        <td className="p-3 text-right">
                          {formatNumber(day.unique_customers)}
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(day.revenue_kes)}
                        </td>
                        <td className="p-3 text-right">
                          {formatUSD(day.revenue_usd)}
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(day.avg_order_value)}
                        </td>
                        <td className="p-3 text-right">
                          {formatNumber(day.total_minutes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hourly Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Distribution</CardTitle>
          <CardDescription>When do customers rent most?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour_of_day"
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis yAxisId="left" />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === "order_count")
                      return [parseNumber(value).toLocaleString(), "Orders"];
                    if (name === "avg_amount")
                      return [formatCurrency(value), "Avg Amount"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="order_count"
                  fill="#40E0D0"
                  name="Orders"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avg_amount"
                  stroke="#ef4444"
                  name="Avg Amount"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Peak Hours</h3>
              {[...hourlyData] // Create a copy using spread operator
                .sort((a, b) => b.order_count - a.order_count)
                .slice(0, 5)
                .map((hour) => (
                  <div
                    key={hour.hour_of_day}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {hour.hour_of_day}:00 - {hour.hour_of_day + 1}:00
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {formatNumber(hour.order_count)} orders
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(hour.percentage)} of daily
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>Customer breakdown by gender</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue_percentage"
                  // label={(
                  //   entry: any, // Use any for the entry
                  // ) =>
                  //   `${entry.gender || "Unknown"}: ${parseNumber(entry.revenue_percentage).toFixed(1)}%`
                  // }
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.gender === "Female"
                          ? "#ec4899"
                          : entry.gender === "Male"
                            ? "#3b82f6"
                            : "#9ca3af"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => {
                    if (name === "revenue_percentage")
                      return [`${parseNumber(value).toFixed(1)}%`, "Revenue %"];
                    return [value, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              {genderData.map((gender) => (
                <div
                  key={gender.gender || "unknown"}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User
                        className={`h-5 w-5 ${
                          gender.gender === "Female"
                            ? "text-pink-500"
                            : gender.gender === "Male"
                              ? "text-blue-500"
                              : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium">
                        {gender.gender || "Unknown"}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {formatNumber(gender.customer_count)} customers
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-xs text-gray-500">Revenue Share</div>
                      <div className="font-bold">
                        {formatPercentage(gender.revenue_percentage)}
                      </div>
                      <div className="text-xs">
                        {formatUSD(gender.revenue_usd)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Customer Share
                      </div>
                      <div className="font-bold">
                        {formatPercentage(gender.customer_percentage)}
                      </div>
                      <div className="text-xs">
                        {formatNumber(gender.rental_count)} rentals
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
