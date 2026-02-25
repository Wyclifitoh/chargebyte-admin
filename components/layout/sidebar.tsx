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
  MapPin,
  PieChart,
  PlusCircle,
  List,
  FileText,
  ChevronDown,
  Shield,
  DollarSign,
  Heart,
  Eye,
  TrendingUp,
  UserCheck,
  ClipboardList,
  Target,
  UserPlus,
  PhoneCall,
  Calendar,
  BarChart,
} from "lucide-react";

const getRoleDashboard = (role: string) => {
  const dashboards: Record<string, string> = {
    super_admin: '/dashboard/super-admin',
    admin: '/dashboard/admin',
    staff: '/dashboard/staff',
    location_partner: '/dashboard/location-partner',
    ad_client: '/dashboard/advertising-partner',
    sponsor: '/dashboard/sponsor',
  };
  return dashboards[role] || '/dashboard';
};

const menuItems = [
  {
    title: "Dashboard",
    href: "#dashboard",
    icon: Zap,
    roles: ["super_admin", "admin", "staff", "location_partner", "ad_client", "sponsor"],
    dynamic: true,
  },
  {
    title: "Team Management",
    href: "/team",
    icon: Users,
    roles: ["super_admin", "admin"],
    items: [
      {
        title: "Team Members",
        href: "/dashboard/team/members",
        icon: Users,
      },
      {
        title: "Attendance",
        href: "/dashboard/team/attendance",
        icon: UserCheck,
      },
      {
        title: "Performance",
        href: "/dashboard/team/performance",
        icon: BarChart,
      },
      {
        title: "Reports",
        href: "/dashboard/team/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "CRM",
    href: "/crm",
    icon: Target,
    roles: ["super_admin", "admin", "staff"],
    items: [
      {
        title: "Leads",
        href: "/dashboard/crm/leads",
        icon: UserPlus,
      },
      {
        title: "Customers",
        href: "/dashboard/crm/customers",
        icon: Users,
      },
      {
        title: "Follow-ups",
        href: "/dashboard/crm/followups",
        icon: PhoneCall,
      },
      {
        title: "Weekly Plans",
        href: "/dashboard/crm/plans",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["super_admin", "admin", "staff"],
  },
  {
    title: "Activations",
    href: "/activations",
    icon: MapPin,
    roles: ["super_admin", "admin", "staff"],
    items: [
      {
        title: "Activation Records",
        href: "/dashboard/activations/list",
        icon: List,
      },
      {
        title: "Add Activation",
        href: "/dashboard/activations/new",
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "Rentals",
    href: "/dashboard/rentals",
    icon: Battery,
    roles: ["super_admin", "admin", "staff"],
  },
  {
    title: "Stations",
    href: "/dashboard/admin/stations",
    icon: Building2,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Powerbanks",
    href: "/dashboard/admin/powerbanks",
    icon: Battery,
    roles: ["super_admin", "admin"],
  },
  {
    title: "My Stations",
    href: "/dashboard/location-partner",
    icon: MapPin,
    roles: ["location_partner"],
  },
  {
    title: "Revenue Share",
    href: "/dashboard/location-partner",
    icon: DollarSign,
    roles: ["location_partner"],
  },
  {
    title: "Ad Campaigns",
    href: "/dashboard/advertising-partner",
    icon: Eye,
    roles: ["ad_client"],
  },
  {
    title: "My Contributions",
    href: "/dashboard/sponsor",
    icon: Heart,
    roles: ["sponsor"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["super_admin", "admin", "staff", "location_partner", "ad_client", "sponsor"],
  },
];

import { useState } from "react";

function MenuItemWithDropdown({
  item,
  pathname,
  hasPermission,
}: {
  item: any;
  pathname: string;
  hasPermission: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  const isActive =
    pathname.startsWith(item.href) ||
    (item.items &&
      item.items.some((subItem: any) => pathname.startsWith(subItem.href)));

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
            : "text-gray-700 hover:bg-gray-50 hover:text-primary-600",
        )}
      >
        <div className="flex items-center space-x-3">
          <Icon
            className={cn(
              "h-5 w-5 transition-colors",
              isActive
                ? "text-primary-600"
                : "text-gray-500 group-hover:text-primary-500",
            )}
          />
          <span className="font-medium">{item.title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {item.items.map((subItem: any) => {
            const SubIcon = subItem.icon;
            const isSubActive = pathname.startsWith(subItem.href);

            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isSubActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-600",
                )}
              >
                <SubIcon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isSubActive
                      ? "text-primary-600"
                      : "text-gray-400 group-hover:text-primary-500",
                  )}
                />
                <span className="text-sm">{subItem.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Update the main Sidebar component
export function Sidebar() {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();

  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(item.roles as any),
  );

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          // If menu item has sub-items, render dropdown version
          if (item.items) {
            return (
              <MenuItemWithDropdown
                key={item.href}
                item={item}
                pathname={pathname}
                hasPermission={hasPermission}
              />
            );
          }

          // Regular menu item
          const Icon = item.icon;
          const actualHref = item.dynamic && user?.role ? getRoleDashboard(user.role) : item.href;
          const isActive = pathname.startsWith(actualHref);

          return (
            <Link
              key={item.href}
              href={actualHref}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary-600",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-primary-600"
                    : "text-gray-500 group-hover:text-primary-500",
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
