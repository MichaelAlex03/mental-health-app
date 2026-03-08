"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  FileText,
  HeartHandshake,
  Wrench,
  Dot,
} from "lucide-react";
import { Category } from "./home/components/post-feed";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/protected/home" },
  { icon: Bookmark, label: "Saved", href: "/protected/saved" },
  { icon: FileText, label: "My Posts", href: "/protected/my-posts" },
];

const SPACE_ITEMS = [
  { icon: Dot, label: "Anxiety", href: "/protected/home?space=anxiety" },
  { icon: Dot, label: "Depression", href: "/protected/home?space=depression" },
  { icon: Dot, label: "Self-care", href: "/protected/home?space=self-care" },
  { icon: Dot, label: "Relationships", href: "/protected/home?space=relationships" },
  { icon: Dot, label: "Grief", href: "/protected/home?space=grief" },
  { icon: Dot, label: "Recovery", href: "/protected/home?space=recovery" },
];

const RESOURCE_ITEMS = [
  { icon: HeartHandshake, label: "Crisis Help", href: "/protected/crisis" },
  { icon: Wrench, label: "Coping Tools", href: "/protected/tools" },
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
      <p className="mt-4 px-3.5 pb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        Spaces
      </p>
      {SPACE_ITEMS.map((item) => (
        <SidebarItem
          key={item.href}
          icon={<item.icon size={18} />}
          label={item.label}
          href={item.href}
          active={pathname === item.href}
        />
      ))}

      <p className="mt-4 px-3.5 pb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        Resources
      </p>
      {RESOURCE_ITEMS.map((item) => (
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
