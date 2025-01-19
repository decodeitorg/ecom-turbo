import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Home, RefreshCcw } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcambProps {
  items: BreadcrumbItem[];
}

export default function Breadcamb({ items }: BreadcambProps) {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">
                  <Home className="h-5 w-5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.path ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.path}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <RefreshCcw
        className={`h-6 w-6 cursor-pointer text-muted-foreground hover:animate-spin`}
        onClick={() => {
          window.location.reload();
        }}
      />
    </header>
  );
}
