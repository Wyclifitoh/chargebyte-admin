"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { Zap } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("super_admin");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock login - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - Add more users here
    const validUsers = [
      {
        email: "ochieng@chargebyte.io",
        password: "admin@ChargeByte",
        userData: {
          id: "1",
          email: "ochieng@chargebyte.io",
          name: "Quinter Ochieng",
          role: "super_admin" as const,
        },
      },
      {
        email: "info@chargebyte.io",
        password: "@!CBAfrica2023",
        userData: {
          id: "2",
          email: "info@chargebyte.io",
          name: "ChargeByte Africa",
          role: "super_admin" as const,
        },
      },
      {
        email: "stephannie@chargebyte.io",
        password: "@!CBAfrica2023",
        userData: {
          id: "3",
          email: "stephannie@chargebyte.io",
          name: "Stephannie Mwangi",
          role: "staff" as const,
        },
      },
      {
        email: "partner@example.com",
        password: "partner123",
        userData: {
          id: "3",
          email: "partner@example.com",
          name: "Location Partner",
          role: "location_partner" as const,
        },
      },
    ];

    // Find matching user
    const matchedUser = validUsers.find((user) => user.email === email);

    if (!matchedUser) {
      toast.error("Invalid email address!");
      setLoading(false);
      return;
    }

    if (matchedUser.password !== password) {
      toast.error("Incorrect password!");
      setLoading(false);
      return;
    }

    // Check if role matches (if role selection is required)
    if (role && matchedUser.userData.role !== role) {
      toast.error("Selected role doesn't match user's role!");
      setLoading(false);
      return;
    }

    login(matchedUser.userData);

    // Redirect based on role
    switch (matchedUser.userData.role) {
      case "super_admin":
        router.push("/dashboard/admin");
        break;
      case "location_partner":
        router.push("/dashboard/rentals");
        break;
      default:
        router.push("/dashboard/rentals");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            {/* <div className="p-3 bg-primary-500 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div> */}
            <img
              src="/images/logo/logo.png"
              alt="ChargeByte Logo"
              className="h-16 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Chargebyte
            </CardTitle>
            <CardDescription className="text-gray-600">
              Smart Powerbank Rental System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
                placeholder="Enter your password"
              />
            </div>

            <div className="space-y-2 hidden">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="location_partner">
                    Location Partner
                  </SelectItem>
                  <SelectItem value="ad_client">
                    Advertisement Client
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
