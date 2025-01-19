import React from "react";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const NotificationsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-0">
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">
            5
          </Badge>
          <Bell className="h-6 w-6 text-blue-900" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-base font-semibold">
            📣 Edit your information
          </span>
          <span className="text-sm text-gray-500">
            Sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim.
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-base font-semibold">
            🚀 Say goodbye to paper receipts!
          </span>
          <span className="text-sm text-gray-500">
            Sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim.
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-base font-semibold">
            📣 Edit your information
          </span>
          <span className="text-sm text-gray-500">
            Sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim.
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
