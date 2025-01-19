import React, { useEffect, useState } from "react";

import { Button } from "./button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import { sidelinks } from "./sidelinks";
import { useStore } from "@nanostores/react";
import { $siteSettingData } from "@/store/frontend";
import { $userData } from "@/store/user";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Menu, X } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
    className,
    isCollapsed,
    setIsCollapsed,
}: SidebarProps) {
    const [navOpened, setNavOpened] = useState(false);
    const navigate = useNavigate();

    const frontend = useStore($siteSettingData);
    const userData = useStore($userData);

    /* Make body not scrollable when navBar is opened */
    useEffect(() => {
        if (navOpened) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [navOpened]);

    return (
        <aside
            className={cn(
                `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${
                    isCollapsed ? "md:w-14" : "md:w-64"
                }`,
                className
            )}
        >
            {/* Overlay in mobile */}
            <div
                onClick={() => setNavOpened(false)}
                className={`absolute inset-0 -z-10 transition-[opacity] delay-100 duration-700 ${
                    navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
                } w-full md:hidden`}
            />

            {/* <Layout fixed className={navOpened ? "h-svh" : ""}>
  
        <Layout.Header
          sticky
          className="z-50 flex justify-between px-4 py-3 shadow-sm md:px-4"
        >*/}
            <div className={`flex items-center justify-between p-2`}>
                <div
                    className={`flex items-center ${
                        !isCollapsed ? "gap-2" : ""
                    } cursor-pointer justify-between`}
                    onClick={() => navigate("/admin")}
                >
                    <img
                        src={frontend?.logo}
                        alt="Logo"
                        className={`h-8 w-8 transition-all`}
                    />

                    <span className="font-medium">
                        {!isCollapsed && frontend?.name}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Toggle Navigation"
                    aria-controls="sidebar-menu"
                    aria-expanded={navOpened}
                    onClick={() => setNavOpened((prev) => !prev)}
                >
                    {navOpened ? <X /> : <Menu />}
                </Button>
            </div>
            {/* </Layout.Header> */}
            {/* Toggle Button in mobile */}

            {/* Navigation links */}
            <Nav
                id="sidebar-menu"
                className={`z-40 h-full flex-1 overflow-auto ${
                    navOpened
                        ? "max-h-screen"
                        : "max-h-0 py-0 md:max-h-screen md:py-2"
                }`}
                closeNav={() => setNavOpened(false)}
                isCollapsed={isCollapsed}
                links={sidelinks()}
            />

            {/* Scrollbar width toggle button */}
            <Button
                onClick={() => setIsCollapsed((prev) => !prev)}
                size="icon"
                variant="outline"
                className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
            >
                <ChevronLeft
                    stroke={1.5}
                    className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
                />
            </Button>
            {/* </Layout> */}
        </aside>
    );
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
    ({ className, sticky, ...props }, ref) => {
        // Check if Layout.Header is used within Layout
        const contextVal = React.useContext(LayoutContext);
        if (contextVal === null) {
            throw new Error(
                `Layout.Header must be used within ${Layout.displayName}.`
            );
        }

        return (
            <div
                ref={ref}
                data-layout="header"
                className={cn(
                    `z-10 flex h-[var(--header-height)] items-center gap-4 bg-background p-4 md:px-8`,
                    contextVal.offset > 10 && sticky ? "shadow" : "shadow-none",
                    contextVal.fixed && "flex-none",
                    sticky && "sticky top-0",
                    className
                )}
                {...props}
            />
        );
    }
);
