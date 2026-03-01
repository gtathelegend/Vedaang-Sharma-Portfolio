"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import AdminTopbar from "@/app/admin/components/AdminTopbar";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default function AdminPanelLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin/dashboard")}`);
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return <div className="min-h-screen bg-slate-100" />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
