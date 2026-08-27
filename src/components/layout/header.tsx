import * as React from "react"
import Link from "next/link"
import { Container } from "./container"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/features/cart/components/cart-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrandLogo } from "./brand-logo"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <BrandLogo />
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
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}
