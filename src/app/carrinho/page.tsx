import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CartPageClient } from '@/features/cart/components/cart-page-client';

export const metadata: Metadata = {
  title: 'Carrinho de Compras | BRPNEU',
  description: 'Revise os itens do seu carrinho antes de finalizar a compra.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Section className="pt-6 pb-12">
        <Container>
          <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Carrinho</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-8">Meu Carrinho</h1>
          
          <CartPageClient />
        </Container>
      </Section>
    </div>
  );
}
