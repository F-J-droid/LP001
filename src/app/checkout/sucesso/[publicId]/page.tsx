import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="bg-card border border-muted rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageCheck className="w-12 h-12 text-success" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">Pedido criado com sucesso!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Seus dados e itens foram processados e seu estoque já foi reservado temporariamente.
        </p>
        
        <div className="bg-muted/30 border border-muted rounded-2xl p-6 text-left mb-8 space-y-4">
          <div className="flex flex-col gap-1 border-b border-muted/50 pb-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Número do Pedido</span>
            <span className="text-2xl font-mono font-black text-primary">{publicId}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-bold text-muted-foreground">Status atual:</span>
            <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Aguardando pagamento
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-bold px-8 h-14">
            <Link href="/">VOLTAR PARA A LOJA</Link>
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-success" />
          A integração de pagamento real será implementada na próxima fase.
        </div>
      </div>
    </main>
  );
}
