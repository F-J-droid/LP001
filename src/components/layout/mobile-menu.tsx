'use client';

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link href="/pneus" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
            Pneus
          </Link>
          <Link href="/?mode=vehicle" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
            Por veículo
          </Link>
          <Link href="/?mode=measure" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
            Por medida
          </Link>
          <Link href="/ofertas" onClick={() => setOpen(false)} className="text-lg font-medium text-accent hover:opacity-80 transition-opacity">
            Ofertas
          </Link>
          <div className="h-px bg-muted my-4" />
          <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(false)}>
            Entrar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
