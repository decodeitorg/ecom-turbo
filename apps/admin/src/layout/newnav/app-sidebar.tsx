import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  HomeIcon,
  PackageIcon,
  UsersIcon,
  SettingsIcon,
  ShoppingCartIcon,
  FileTextIcon,
  TruckIcon,
  XCircleIcon,
  CheckCircleIcon,
  EditIcon,
  GlobeIcon,
  ChartBarStacked,
} from "lucide-react";

import NavGroup from "./nav-group";
// import { NavSecondary } from './nav-secondary';
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useStore } from "@nanostores/react";
import { $dashboardData } from "@/store/dashBoard";
import { $userData } from "@/store/user";
import { $siteSettingData } from "@/store/frontend";
import { Avatar } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import DateMonthYearPicker from "@/components/dashboard/DateMonthYearPicker";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dashboardData = useStore($dashboardData);
  const dashboardOrderCount = dashboardData?.dashboardOrderCount;
  const userData = useStore($userData);
  const frontend = useStore($siteSettingData);

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/images/no-image.png",
    },
    navAdmin: [
      {
        icon: HomeIcon,
        title: "Dashboard",
        url: "/admin",
      },
      {
        icon: PackageIcon,
        title: "Manage Products",
        url: "/admin/products",
        items: [
          {
            title: "Add Products",
            icon: EditIcon,
            url: "/admin/products/add-product",
          },
          {
            title: "Products",
            icon: PackageIcon,
            url: "/admin/products",
          },
          {
            title: "Categories",
            icon: UsersIcon,
            url: "/admin/products/categories",
          },
          {
            title: "Attributes",
            icon: ChartBarStacked,
            url: "/admin/products/attributes",
          },
        ],
      },
      {
        icon: ShoppingCartIcon,
        title: "Orders",
        url: "/admin/orders",
        label:
          (Number(dashboardOrderCount?.pending) || 0) +
          (Number(dashboardOrderCount?.processing) || 0) +
          (Number(dashboardOrderCount?.onDelivery) || 0) +
          (Number(dashboardOrderCount?.delivered) || 0) +
          (Number(dashboardOrderCount?.cancelled) || 0),
        items: [
          {
            title: "Pending Orders",
            icon: FileTextIcon,
            url: "/admin/orders/pending",
            label: dashboardOrderCount?.pending?.count,
          },
          {
            title: "Processing Orders",
            icon: TruckIcon,
            url: "/admin/orders/processing",
            label: dashboardOrderCount?.processing?.count,
          },
          {
            title: "On-Delivery Orders",
            icon: TruckIcon,
            url: "/admin/orders/onDelivery",
            label: dashboardOrderCount?.onDelivery?.count,
          },
          {
            title: "Delivered Orders",
            icon: CheckCircleIcon,
            url: "/admin/orders/delivered",
            label: dashboardOrderCount?.delivered?.count,
          },
          {
            title: "Cancelled Orders",
            icon: XCircleIcon,
            url: "/admin/orders/cancelled",
            label: dashboardOrderCount?.cancelled?.count,
          },
        ],
      },
      {
        icon: GlobeIcon,
        title: "Frontend",
        url: "/admin/landingpage",
        items: [
          {
            title: "Landing Page",
            icon: GlobeIcon,
            url: "/admin/landingpage",
          },
          {
            title: "Site Settings",
            icon: SettingsIcon,
            url: "/admin/landingpage/site-setting",
          },
          {
            title: "Legal Settings",
            icon: FileTextIcon,
            url: "/admin/landingpage/legal-setting",
          },
        ],
      },
    ],
    // navSecondary: [
    //   {
    //     title: 'Support',
    //     url: '#',
    //     icon: LifeBuoy,
    //   },
    //   {
    //     title: 'Feedback',
    //     url: '#',
    //     icon: Send,
    //   },
    // ],
    superAdmin: [
      {
        title: "Users",
        icon: UsersIcon,
        url: "/admin/users",
      },
      {
        title: "Employees",
        icon: UsersIcon,
        url: "/admin/employees",
      },
      {
        title: "Settings",
        icon: SettingsIcon,
        url: "/admin/settings",
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src={frontend?.logo}
                    alt="Logo"
                    className="h-8 w-8 transition-all"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {frontend?.name}
                  </span>
                  <span className="truncate text-xs">
                    {frontend?.siteDescription}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={data.navAdmin} title="Admin" />
        {userData?.role === "SuperAdmin" && (
          <NavGroup items={data.superAdmin} title="SuperAdmin" />
        )}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <DateMonthYearPicker />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
