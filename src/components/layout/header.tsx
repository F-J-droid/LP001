import * as React from "react"
import Link from "next/link"
import { Container } from "./container"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/features/cart/components/cart-button"

import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-secondary">
                Tire<span className="text-primary">Store</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="#" className="transition-colors hover:text-primary">Pneus</Link>
              <Link href="#" className="transition-colors hover:text-primary">Por veículo</Link>
              <Link href="#" className="transition-colors hover:text-primary">Por medida</Link>
              <Link href="#" className="transition-colors hover:text-primary">Marcas</Link>
              <Link href="#" className="transition-colors hover:text-primary text-accent">Ofertas</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm">Entrar</Button>
            </div>
            <CartButton />
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
