"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import { Bell, CircleUser, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/context/SessionContext";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import { UserProfileDialog } from "../../(main)/dashboard/_components/sidebar/user-profile-dialog";

export function AdminNavUser() {
  const { user } = useSession();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentUser = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl || "",
        role: user.roles?.[0] || "User",
      }
    : { name: "Loading...", role: "", avatar: "", id: "", email: "" };

  const handleLogout = () => {
    logout();
    Cookies.remove("access_token");
    Cookies.remove("user_permissions");
    router.push("/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 cursor-pointer rounded-lg">
            <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
            <AvatarFallback className="rounded-lg">{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
          <DropdownMenuItem className="border-l-2 border-l-primary bg-accent/50 p-0">
            <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg">{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentUser.name}</span>
                <span className="truncate text-muted-foreground text-xs capitalize">{currentUser.role}</span>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <CircleUser />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileDialog isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
}
