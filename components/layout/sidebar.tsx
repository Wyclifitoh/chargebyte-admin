"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Zap,
  BarChart3,
  Megaphone,
  Settings,
  Users,
  Building2,
  Battery,
  Activity,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: Zap,
    roles: ["super_admin", "location_partner"],
  },
  {
    title: "Rentals",
    href: "/dashboard/rentals",
    icon: Battery,
    roles: ["super_admin", "staff", "location_partner"],
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: Megaphone,
    roles: ["super_admin", "staff", "ad_client"],
  },
  // {
  //   title: 'Analytics',
  //   href: '/dashboard/analytics',
  //   icon: BarChart3,
  //   roles: ['super_admin', 'staff'],
  // },
  {
    title: "Stations",
    href: "/dashboard/admin/stations",
    icon: Building2,
    roles: ["super_admin", "staff"],
  },
  {
    title: "Powerbanks",
    href: "/dashboard/admin/powerbanks",
    icon: Battery,
    roles: ["super_admin", "staff"],
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["super_admin", "staff"],
  },
  {
    title: "System Logs",
    href: "/dashboard/admin/logs",
    icon: Activity,
    roles: ["super_admin", "staff"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["super_admin", "staff", "location_partner", "ad_client"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();

  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(item.roles as any)
  );

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chargebyte</h1>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role.replace("_", " ")}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-primary-600"
                    : "text-gray-500 group-hover:text-primary-500"
                )}
              />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
