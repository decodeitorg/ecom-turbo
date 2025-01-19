import { ChevronRight, type LucideIcon } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export default function NavGroup({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    label?: string | number;
    items?: {
      title: string;
      url: string;
      label?: string | number;
    }[];
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isCollapsibleActive = location.pathname?.includes(item.url);
          return (
            <Collapsible
              key={item.title + (item.label ? `-${item.label}` : "")}
              asChild
              defaultOpen={isCollapsibleActive}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title + (item.label ? `-${item.label}` : "")}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>
                      {item.title + (item.label ? `-${item.label}` : "")}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSidebarMenuItemActive =
                            location.pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem
                              key={
                                subItem.title +
                                (subItem.label ? `-${subItem.label}` : "")
                              }
                            >
                              <SidebarMenuSubButton
                                isActive={isSidebarMenuItemActive}
                                asChild
                              >
                                <Link to={subItem.url}>
                                  <span>
                                    {subItem.title +
                                      (subItem.label
                                        ? `-${subItem.label}`
                                        : "")}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
