import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { CheckoutForm } from '@/features/checkout/components/checkout-form';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Finalizar compra | TireStore',
  robots: {
    index: false,
    follow: false,
  }
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Simplified Header for Checkout */}
      <header className="bg-background border-b sticky top-0 z-50">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-secondary">
                Tire<span className="text-primary">Store</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-sm font-bold text-success uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5" />
              <span className="hidden sm:inline">Compra Segura</span>
            </div>
          </div>
        </Container>
      </header>

      <Section className="pt-8 pb-12">
        <Container>
          <h1 className="text-3xl font-black text-foreground mb-8">Finalizar Pedido</h1>
          <CheckoutForm />
        </Container>
      </Section>
    </div>
  );
}
