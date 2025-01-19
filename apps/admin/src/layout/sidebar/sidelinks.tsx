import { $dashboardData } from "@/store/dashBoard";
import { $userData } from "@/store/user";
import { useStore } from "@nanostores/react";
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

import React from "react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export function sidelinks() {
  const dashboardData = useStore($dashboardData);
  const dashboardOrderCount = dashboardData?.dashboardOrderCount;
  const userData = useStore($userData);
  let sidbar = [
    {
      icon: <HomeIcon size={16} />,
      title: "Dashboard",
      href: "/admin",
    },
    {
      icon: <PackageIcon size={16} />, // Changed to PackageIcon for "Manage Products"
      title: "Manage Products",
      href: "/admin/products",
      sub: [
        {
          title: "Add Products",
          icon: <EditIcon size={16} />, // Changed to EditIcon for "Add Products"
          href: "/admin/products/add-product",
        },
        {
          title: "Products",
          icon: <PackageIcon size={16} />,
          href: "/admin/products",
        },
        {
          title: "Categories",
          icon: <UsersIcon size={16} />, // Changed to UsersIcon for "Categories"
          href: "/admin/products/categories",
        },
        {
          title: "Attributes",
          icon: <ChartBarStacked size={16} />, // Changed to SettingsIcon for "Attributes"
          href: "/admin/products/attributes",
        },
      ],
    },
    {
      icon: <ShoppingCartIcon size={16} />,
      title: "Order Management",
      href: "/admin/orders",
      sub: [
        {
          title: "Pending Orders",
          icon: <FileTextIcon size={16} />,
          href: "/admin/orders/pending",
          label: dashboardOrderCount?.pending?.count,
        },
        {
          title: "Processing Orders",
          icon: <TruckIcon size={16} />,
          href: "/admin/orders/processing",
          label: dashboardOrderCount?.processing?.count,
        },
        {
          title: "On-Delivery Orders",
          icon: <TruckIcon size={16} />,
          href: "/admin/orders/onDelivery",
          label: dashboardOrderCount?.onDelivery,
        },
        {
          title: "Delivered Orders",
          icon: <CheckCircleIcon size={16} />,
          href: "/admin/orders/delivered",
          label: dashboardOrderCount?.delivered,
        },
        {
          title: "Cancelled Orders",
          icon: <XCircleIcon size={16} />,
          href: "/admin/orders/cancelled",
          label: dashboardOrderCount?.cancelled,
        },
      ],
    },
    {
      icon: <GlobeIcon size={16} />, // Changed to GlobeIcon for "Frontend"
      title: "Frontend",
      href: "/admin/landingpage",
      sub: [
        {
          title: "Landing Page",
          icon: <GlobeIcon size={16} />,
          href: "/admin/landingpage",
        },
        {
          title: "Site Settings",
          icon: <SettingsIcon size={16} />, // Changed to SettingsIcon for "Site Settings"
          href: "/admin/landingpage/site-setting",
        },
        {
          title: "Legal Settings",
          icon: <FileTextIcon size={16} />, // Changed to FileTextIcon for "Legal Settings"
          href: "/admin/landingpage/legal-setting",
        },
      ],
    },
  ];

  if (userData?.role === "SuperAdmin") {
    sidbar.push({
      icon: <SettingsIcon size={16} />, // Changed to SettingsIcon for "SuperAdmin"
      title: "SuperAdmin",
      href: "/admin/users",
      sub: [
        {
          title: "Users",
          icon: <UsersIcon size={16} />,
          href: "/admin/users",
        },
        {
          title: "Employees",
          icon: <UsersIcon size={16} />,
          href: "/admin/employees",
        },
        {
          title: "Settings",
          icon: <SettingsIcon size={16} />,
          href: "/admin/settings",
        },
      ],
    });
  }

  return sidbar;
}

export default sidelinks;
