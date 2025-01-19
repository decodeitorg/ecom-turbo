import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { $userData, $userLoading, logOutTheUserCompletely } from "@/store/user";
import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import ManageNotification from "@/components/Notificaiton";

export const UserDropdown = () => {
  const userData = useStore($userData);

  const userLoading = useStore($userLoading);

  return (
    <>
      {!userLoading && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={userData?.image} alt="user" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-medium">{userData?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {userData?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/admin/profile" className="flex w-full items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Profile Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between">
              <p>Notification</p> <ManageNotification />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                onClick={() => logOutTheUserCompletely()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Log Out
              </Button>
            </DropdownMenuItem>

            {/* <DropdownItem key="switch">
               <DarkModeSwitch />
               </DropdownItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
