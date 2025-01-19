import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import Nav from "../navbar/navbar";

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <SkipToMain />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? "md:ml-14" : "md:ml-64"
        } h-full`}
      >
        <Nav isCollapsed={isCollapsed} />
        <Outlet />
      </main>
    </div>
  );
}

const SkipToMain = () => {
  return (
    <a
      className={`fixed left-44 z-[999] -translate-y-52 whitespace-nowrap bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-95 shadow transition hover:bg-primary/90 focus:translate-y-3 focus:transform focus-visible:ring-1 focus-visible:ring-ring`}
      href="#content"
    >
      Skip to Main
    </a>
  );
};
