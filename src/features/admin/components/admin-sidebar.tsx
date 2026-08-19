'use client';

import { AdminNav } from './admin-nav';

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex w-72 flex-col border-r bg-card sticky top-0 h-screen">
      <AdminNav />
    </aside>
  );
}
