"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { getAllActivations } from "@/lib/api/activations";

const COUNTIES = [
  "All Counties",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kisii",
  "Kakamega",
];

const STATUS_OPTIONS = [
  "All Status",
  "scheduled",
  "visited",
  "completed",
  "cancelled",
];

const AGENTS = [
  "All Agents",
  "John Doe",
  "Jane Smith",
  "Robert Johnson",
  "Sarah Williams",
];

interface Activation {
  id: string;
  locationName: string;
  county: string;
  address: string;
  agentName: string;
  status: "scheduled" | "visited" | "completed" | "cancelled";
  activationDate: string;
  peopleReached: number;
  contactPerson: string;
  contactPhone: string;
}

export default function ActivationsListPage() {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [filteredActivations, setFilteredActivations] = useState<Activation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    county: "All Counties",
    status: "All Status",
    agent: "All Agents",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchActivations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, activations]);

  const fetchActivations = async () => {
    try {
      setLoading(true);
      const response = await getAllActivations();
      setActivations(response.data);
      setFilteredActivations(response.data);
    } catch (error) {
      console.error("Error fetching activations:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activations];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (act) =>
          act.locationName.toLowerCase().includes(searchLower) ||
          act.county.toLowerCase().includes(searchLower) ||
          act.address.toLowerCase().includes(searchLower) ||
          act.contactPerson.toLowerCase().includes(searchLower),
      );
    }

    // County filter
    if (filters.county !== "All Counties") {
      filtered = filtered.filter((act) => act.county === filters.county);
    }

    // Status filter
    if (filters.status !== "All Status") {
      filtered = filtered.filter((act) => act.status === filters.status);
    }

    // Agent filter
    if (filters.agent !== "All Agents") {
      filtered = filtered.filter((act) => act.agentName === filters.agent);
    }

    // Date filter
    if (filters.startDate) {
      filtered = filtered.filter(
        (act) => new Date(act.activationDate) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (act) => new Date(act.activationDate) <= new Date(filters.endDate),
      );
    }

    setFilteredActivations(filtered);
    setCurrentPage(1);
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
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      county: "All Counties",
      status: "All Status",
      agent: "All Agents",
      startDate: "",
      endDate: "",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredActivations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivations = filteredActivations.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading activations...</p>
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
            Activation Records
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all activation locations
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchActivations}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search locations..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* County Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">County</label>
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
              <label className="text-sm font-medium">Status</label>
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

            {/* Agent Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent</label>
              <Select
                value={filters.agent}
                onValueChange={(value) => handleFilterChange("agent", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {AGENTS.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
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
              <label className="text-sm font-medium">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredActivations.length)} of{" "}
          {filteredActivations.length} activations
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>People Reached</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentActivations.map((activation) => (
                  <TableRow key={activation.id}>
                    <TableCell className="font-medium">
                      {activation.locationName}
                    </TableCell>
                    <TableCell>{activation.county}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {activation.address}
                    </TableCell>
                    <TableCell>{activation.agentName}</TableCell>
                    <TableCell>{getStatusBadge(activation.status)}</TableCell>
                    <TableCell>
                      {new Date(activation.activationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {activation.peopleReached.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{activation.contactPerson}</div>
                        <div className="text-gray-500">
                          {activation.contactPhone}
                        </div>
                      </div>
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
