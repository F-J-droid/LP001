'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminNav } from './admin-nav';

export function AdminHeader() {
  return (
    <header className="h-16 border-b bg-card flex items-center px-4 md:px-8 justify-between lg:justify-end sticky top-0 z-30">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="-ml-2" />}>
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r-0">
            <AdminNav isMobile />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">Admin</div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
}
