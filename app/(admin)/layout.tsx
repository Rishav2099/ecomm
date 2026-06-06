import { AdminNavbar } from "@/components/admin/admin-navbar";
import { requireAdmin } from "@/lib/auth-utils";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <AdminNavbar />

      {/* Main Content Area */}
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto py-6 px-4 md:px-8">{children}</div>
      </main>
    </div>
  );
};

export default layout;
