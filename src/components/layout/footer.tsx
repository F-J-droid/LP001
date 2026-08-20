import * as React from "react"
import Link from "next/link"
import { Container } from "./container"
import { BrandLogo } from "./brand-logo"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <Container>
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <BrandLogo />
            <p className="text-sm text-muted-foreground/80 max-w-xs mt-4">
              Sua loja especializada em pneus. Segurança, performance e o melhor preço para o seu veículo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Institucional</h4>
            <ul className="space-y-2 text-sm text-muted-foreground/80">
              <li><Link href="#" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Centros de Montagem</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Ajuda e Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground/80">
              <li><Link href="#" className="hover:text-white transition-colors">Central de Atendimento</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Política de Trocas</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Prazos e Entregas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Atendimento</h4>
            <ul className="space-y-2 text-sm text-muted-foreground/80">
              <li>Segunda a Sexta: 08h às 18h</li>
              <li>Sábado: 08h às 12h</li>
              <li className="pt-2 text-white font-medium">WhatsApp: (11) 99999-9999</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted/20 py-6 text-center text-sm text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} BRPNEU. Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  )
}
