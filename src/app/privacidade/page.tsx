import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | BRPNEU'
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Section className="pt-12 pb-12">
        <Container className="max-w-3xl bg-card p-8 md:p-12 rounded-3xl border border-muted shadow-sm">
          <h1 className="text-3xl font-black text-foreground mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-slate prose-invert max-w-none text-muted-foreground space-y-6">
            <p className="font-bold text-foreground">
              Aviso Importante: Este é um ambiente de demonstração (mock). 
              Esta página é um placeholder.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Coleta de Dados</h2>
            <p>
              Nesta fase de demonstração, os dados inseridos no Checkout (como Nome, E-mail, CPF e Endereço) são validados matematicamente no navegador, mas não são salvos em nenhum banco de dados persistente real. 
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Tratamento de Cartão de Crédito</h2>
            <p>
              O sistema atual não coleta e não processa números de cartão de crédito. A interface gráfica é apenas representativa. Quando a integração oficial ocorrer, os dados sensíveis de pagamento passarão diretamente (em token) para o Gateway de Pagamento, não sendo armazenados em nossos servidores.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. LocalStorage</h2>
            <p>
              O carrinho de compras é salvo localmente no seu dispositivo através da tecnologia LocalStorage (`tirestore_cart`). Você pode esvaziar o carrinho a qualquer momento apagando os dados de navegação.
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
