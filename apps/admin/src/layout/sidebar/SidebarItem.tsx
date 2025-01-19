import { Badge } from "@/components/ui/badge.tsx";
import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useSidebarContext } from "../layout-context.ts";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: string;
  href?: string;
  count?: number;
}

export const SidebarItem = ({ icon, title, href = "", count = 0 }: Props) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <Link to={href} className="max-w-full text-default-900 active:bg-none">
      <div
        className={clsx(
          isActive
            ? "bg-primary-100 [&_svg_path]:fill-primary-500"
            : "hover:bg-default-100",
          "flex h-full min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 transition-all duration-150 active:scale-[0.98]"
        )}
        onClick={setCollapsed}
      >
        {icon}
        <span className="mr-2 text-default-900">{title}</span>
        {count > 0 && <Badge>{count}</Badge>}
      </div>
    </Link>
  );
};
