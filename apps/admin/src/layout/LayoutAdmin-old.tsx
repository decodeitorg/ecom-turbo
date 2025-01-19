import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, Outlet, useLocation } from "react-router-dom";
import sidebarLinks from "./sidebar/sidebar";

import {
  $siteSettingData,
  $siteSettingDataLoading,
  $siteSettingDataError,
} from "@/store/frontend";
import { useStore } from "@nanostores/react";

export default function Dashboard({ breadcrumb }) {
  let location = useLocation();

  let siteSettingData = useStore($siteSettingData);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const SidebarLink = ({ link, depth = 0, mobile = false }) => {
    const hasChildren = link.children && link.children.length > 0;
    const isExpanded = expandedSections[link.label];

    return (
      <>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={link.href}
                className={`flex items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground ${
                  mobile
                    ? "h-10 w-full gap-4 px-2.5"
                    : sidebarCollapsed
                      ? "h-9 w-9 justify-center"
                      : `h-10 w-full justify-start px-3 ${depth > 0 ? "pl-8" : ""}`
                } ${location.pathname === link.href ? "bg-accent" : ""} `}
                onClick={(e) => {
                  if (hasChildren) {
                    e.preventDefault();
                    toggleSection(link.label);
                  }
                }}
              >
                {link.icon && (
                  <link.icon className={mobile ? "h-5 w-5" : "mr-2 h-5 w-5"} />
                )}
                {(mobile || !sidebarCollapsed) && (
                  <span className="text-muted-foreground transition-all hover:text-primary">
                    {link.label}
                  </span>
                )}
                {hasChildren && !sidebarCollapsed && (
                  <span className="ml-auto">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
                {sidebarCollapsed && !mobile && (
                  <span className="text-muted-foreground transition-all hover:text-primary">
                    {link.label}
                  </span>
                )}
              </Link>
            </TooltipTrigger>
            {sidebarCollapsed && !mobile && (
              <TooltipContent side="right">{link.label}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="ml-4">
            {link.children.map((childLink, index) => (
              <SidebarLink
                key={index}
                link={childLink}
                depth={depth + 1}
                mobile={mobile}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  const SidebarContent = ({ mobile = false }) => (
    <>
      <Link
        to="/admin"
        className={`group flex shrink-0 items-center justify-start rounded-full text-lg font-semibold text-primary ${
          mobile
            ? "h-10 w-10"
            : sidebarCollapsed
              ? "h-9 w-9"
              : "h-10 w-full justify-start px-3"
        }`}
      >
        <img
          width={64}
          src={siteSettingData?.logo}
          alt={siteSettingData?.name}
        />
        {!sidebarCollapsed && !mobile && <span>{siteSettingData?.name}</span>}
        <span className="sr-only">{siteSettingData?.name}</span>
      </Link>
      {sidebarLinks.map((link, index) => (
        <SidebarLink key={index} link={link} mobile={mobile} />
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside
        className={`fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 lg:flex ${
          sidebarCollapsed ? "w-14" : "w-64"
        }`}
      >
        <nav className="flex flex-col items-start gap-4 px-2 lg:py-5">
          <SidebarContent />
        </nav>
        <nav className="mt-auto flex flex-col items-start gap-4 px-2 lg:py-5">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/settings"
                  className={`flex items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground ${
                    sidebarCollapsed
                      ? "h-9 w-9 justify-center"
                      : "h-10 w-full justify-start px-3"
                  }`}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  {!sidebarCollapsed && <span>Settings</span>}
                  {sidebarCollapsed && (
                    <span className="sr-only">Settings</span>
                  )}
                </Link>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">Settings</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div
        className={`flex flex-col lg:gap-4 ${sidebarCollapsed ? "lg:pl-14" : "lg:pl-64"} transition-all duration-300`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
          <div>
            <Button
              size="icon"
              variant="outline"
              onClick={toggleSidebar}
              className="hidden lg:block"
            >
              <PanelLeft className="mx-auto h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="lg:hidden">
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="lg:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <SidebarContent mobile />
                </nav>
              </SheetContent>
            </Sheet>
            {breadcrumb}
          </div>
          {/* Rest of the header content */}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 lg:gap-8 lg:px-6 lg:py-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
