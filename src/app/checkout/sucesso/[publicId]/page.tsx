import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PackageCheck, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { AsaasService } from '@/features/checkout/services/asaas-service';
import Image from 'next/image';

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  
  const supabase = await createClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('public_id', publicId)
    .single();

  if (!order) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
        <Button asChild><Link href="/">Voltar para a Home</Link></Button>
      </main>
    );
  }

  const isPix = order.payment_method === 'pix';
  let qrCodeData = null;

  if (isPix && order.external_payment_id) {
    try {
      qrCodeData = await AsaasService.getPixQrCode(order.external_payment_id);
    } catch (e) {
      console.error('Failed to fetch PIX QR Code on success page', e);
    }
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="bg-card border border-muted rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageCheck className="w-12 h-12 text-success" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">Pedido recebido com sucesso!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Seus dados e itens foram processados e seu estoque já foi reservado.
        </p>
        
        <div className="bg-muted/30 border border-muted rounded-2xl p-6 text-left mb-8 space-y-4">
          <div className="flex flex-col gap-1 border-b border-muted/50 pb-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Número do Pedido</span>
            <span className="text-2xl font-mono font-black text-primary">{publicId}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-bold text-muted-foreground">Status atual:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              order.payment_status === 'paid' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
            }`}>
              {order.payment_status === 'paid' ? 'Pagamento Aprovado' : 'Aguardando pagamento'}
            </span>
          </div>
        </div>

        {/* PIX Payment Section */}
        {isPix && order.payment_status !== 'paid' && (
          <div className="mb-8 border-2 border-primary/20 bg-primary/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              Finalize seu pagamento via PIX
            </h3>
            
            {qrCodeData?.encodedImage ? (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                  <Image 
                    src={`data:image/png;base64,${qrCodeData.encodedImage}`} 
                    alt="QR Code PIX" 
                    width={200} 
                    height={200} 
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code acima com o app do seu banco ou use o código Copia e Cola abaixo.
                </p>
                <div className="w-full relative mt-2">
                  <textarea 
                    readOnly 
                    value={qrCodeData.payload} 
                    className="w-full text-xs font-mono bg-background border rounded-xl p-3 pr-12 resize-none outline-none"
                    rows={3}
                  />
                  {/* Ideally this would have a client-side copy button, using a simple form action or client component here */}
                  <div className="absolute right-2 top-2 bottom-2 flex items-center">
                     <span className="bg-muted px-2 py-1 rounded text-[10px] font-bold">COPIA E COLA</span>
                  </div>
                </div>
              </div>
            ) : order.payment_url ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Use o código Copia e Cola abaixo no app do seu banco.
                </p>
                <div className="w-full relative mt-2">
                  <textarea 
                    readOnly 
                    value={order.payment_url} 
                    className="w-full text-xs font-mono bg-background border rounded-xl p-3 resize-none outline-none"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
               <p className="text-sm text-muted-foreground">Ocorreu um erro ao gerar o PIX. Verifique seu email para instruções.</p>
            )}
          </div>
        )}

        {/* Credit Card Processing State */}
        {!isPix && order.payment_status === 'pending' && (
          <div className="mb-8 border border-warning/20 bg-warning/5 rounded-2xl p-6 text-warning-foreground">
            <h3 className="font-bold mb-2 flex items-center justify-center gap-2">
              Processando Pagamento...
            </h3>
            <p className="text-sm opacity-80">
              Estamos processando o pagamento com seu cartão de crédito. Você receberá uma confirmação por email assim que for aprovado.
            </p>
          </div>
        )}
        
        {!isPix && order.payment_status === 'paid' && (
          <div className="mb-8 border border-success/20 bg-success/5 rounded-2xl p-6 text-success-foreground">
            <h3 className="font-bold mb-2 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Pagamento Aprovado
            </h3>
            <p className="text-sm opacity-80">
              O pagamento do seu cartão de crédito foi confirmado e seu pedido já está sendo separado!
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-bold px-8 h-14">
            <Link href="/">VOLTAR PARA A LOJA</Link>
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-success" />
          Pagamento processado de forma 100% segura.
        </div>
      </div>
    </main>
  );
}
