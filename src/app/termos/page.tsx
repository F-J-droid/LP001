import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso | TireStore'
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Section className="pt-12 pb-12">
        <Container className="max-w-3xl bg-card p-8 md:p-12 rounded-3xl border border-muted shadow-sm">
          <h1 className="text-3xl font-black text-foreground mb-8">Termos de Uso</h1>
          
          <div className="prose prose-slate prose-invert max-w-none text-muted-foreground space-y-6">
            <p className="font-bold text-foreground">
              Aviso Importante: Este é um ambiente de demonstração (mock). 
              Esta página é um placeholder e não possui valor legal.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Aceitação</h2>
            <p>
              Ao acessar e utilizar a TireStore (ambiente de teste), você concorda com estes termos simulados. 
              Nenhum dado real de compra será processado de forma definitiva nesta etapa.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Simulação de Compras</h2>
            <p>
              Todos os produtos, estoques, fretes e meios de pagamento apresentados no checkout são simulações. 
              Os preços não representam ofertas comerciais reais e o fluxo de pagamento é inteiramente desativado no frontend.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Validação Posterior</h2>
            <p>
              No momento em que o backend for ativado (próxima fase), todos os preços, disponibilidade de estoque e cálculos de frete informados pelo frontend estarão sujeitos a revalidação autoritativa do servidor. O carrinho de compras e o LocalStorage não são fontes de verdade.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-muted">
            <Link href="/" className="font-bold text-primary hover:underline">Voltar para a Home</Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
