import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings } from "lucide-react";
import { Sidebar } from "./sidebar";
import { LogoutButton } from "@/components/logout-button";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 border-b border-border bg-card/85 backdrop-blur-md">
        <Link href="/protected" className="text-lg font-semibold text-primary">
          Haven
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar>
                  {/* TODO: wire up real avatar URL from Supabase Storage */}
                  <AvatarImage src="" alt="User avatar" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/protected/notifications">
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/protected/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogoutButton />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page content */}
      <div className="flex flex-1 px-6 py-6 gap-6">
        <Sidebar/>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
