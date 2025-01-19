import React from "react";
import DateMonthYearPicker from "@/components/dashboard/DateMonthYearPicker.tsx";
import BurgerButton from "./burguer-button.tsx";
import DarkModeSwitch from "./darkmodeswitch.tsx";
import { NotificationsDropdown } from "./notifications-dropdown.tsx";
import { UserDropdown } from "./user-dropdown.tsx";

interface Props {
  children: React.ReactNode;
  isCollapsed: boolean;
}

const NavbarWrapper = ({ children, isCollapsed }: Props) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <nav className="flex w-full items-center justify-between border-b bg-background p-3">
        <div className="lg:hidden">
          <BurgerButton />
        </div>
        <div className="hidden w-full lg:block">
          {/* Placeholder for search input */}
          {/* <Input
            type="search"
            placeholder="Search..."
            className="w-full max-w-sm"
          /> */}
        </div>
        <div className="flex items-center space-x-4">
          {/* <NotificationsDropdown /> */}
          <DateMonthYearPicker />

          <DarkModeSwitch />
          <UserDropdown />
        </div>
      </nav>
      {children}
    </div>
  );
};
export default NavbarWrapper;
