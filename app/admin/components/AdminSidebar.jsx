"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/socials", label: "Social Links" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-6">
      <div className="text-xl font-semibold mb-8">Portfolio Admin</div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg transition ${
                active
                  ? "bg-white text-slate-900"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="text-xs text-slate-400">Admin only</div>
    </aside>
  );
}
