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
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/85 to-slate-900/90"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <Zap className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome to ChargeByte
              </h1>
              <p className="text-lg text-emerald-100">
                Smart Powerbank Rental Management System
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="space-y-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Demo Credentials
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Click any account below to auto-fill login
              </p>
              <div className="space-y-2">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleDemoLogin(user.email)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 group-hover:text-emerald-700">
                        {user.name}
                      </span>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-mono">
                      {user.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                Role Capabilities
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Super Admin:</strong> Full system access & configuration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Admin:</strong> Manage users, stations & analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Staff:</strong> Handle activations & rentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Location Partner:</strong> Track station revenue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  <span><strong>Ad Partner:</strong> Manage ad campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><strong>Sponsor:</strong> View impact & contributions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
