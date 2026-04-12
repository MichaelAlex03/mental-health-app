"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  MessageCircle,
  UsersRound,
} from "lucide-react";


const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/protected/home" },
  { icon: FileText, label: "My Threads", href: "/protected/my-threads" },
  { icon: UsersRound, label: "Joined Threads", href: "/protected/joined-threads" },
  { icon: MessageCircle, label: "Messages", href: "/protected/messages" },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 hidden lg:flex flex-col gap-2 sticky top-20 self-start">
      {NAV_ITEMS.map((item) => (
        <SidebarItem
          key={item.href}
          icon={<item.icon size={18} />}
          label={item.label}
          href={item.href}
          active={pathname === item.href}
        />
      ))}

    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${active
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-secondary"
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}
