"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth, DEMO_USERS, UserRole } from "@/components/providers/auth-provider";
import { Zap, User, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { demoLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = demoLogin(email);

    if (success) {
      const user = DEMO_USERS.find(u => u.email === email);
      toast.success(`Welcome back, ${user?.name}!`);

      switch (user?.role) {
        case "super_admin":
          router.push("/dashboard/super-admin");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "staff":
          router.push("/dashboard/staff");
          break;
        case "location_partner":
          router.push("/dashboard/location-partner");
          break;
        case "ad_client":
          router.push("/dashboard/advertising-partner");
          break;
        case "sponsor":
          router.push("/dashboard/sponsor");
          break;
        default:
          router.push("/dashboard");
      }
    } else {
      toast.error("Invalid credentials. Use demo accounts below.");
    }

    setLoading(false);
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-700 border-purple-200",
      admin: "bg-blue-100 text-blue-700 border-blue-200",
      staff: "bg-green-100 text-green-700 border-green-200",
      location_partner: "bg-orange-100 text-orange-700 border-orange-200",
      ad_client: "bg-pink-100 text-pink-700 border-pink-200",
      sponsor: "bg-cyan-100 text-cyan-700 border-cyan-200",
    };
    return colors[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      staff: "Staff",
      location_partner: "Location Partner",
      ad_client: "Advertising Partner",
      sponsor: "Sponsor",
    };
    return labels[role];
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your ChargeByte account
            </p>
          </div>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-base shadow-lg shadow-emerald-500/30"
                  disabled={loading}
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-teal-600/85 to-emerald-700/90"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <Zap className="h-20 w-20 text-white mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Power On The Go
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-md">
            Empowering your devices, anywhere, anytime. Join the revolution in mobile charging solutions.
          </p>
          <div className="flex items-center gap-3 text-white/80">
            <div className="h-px w-12 bg-white/50"></div>
            <span className="text-sm uppercase tracking-wider">ChargeByte</span>
            <div className="h-px w-12 bg-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
