import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MonitorCheck, Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export default function DarkModeSwitch() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const themeColor = theme === "dark" ? "#020817" : "#fff";
        const metaThemeColor = document.querySelector(
            "meta[name='theme-color']"
        );
        metaThemeColor && metaThemeColor.setAttribute("content", themeColor);
    }, [theme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    {theme === "light" ? (
                        <Sun size={20} />
                    ) : theme === "dark" ? (
                        <Moon size={20} />
                    ) : (
                        <MonitorCheck size={20} />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <MonitorCheck className="mr-2 h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
