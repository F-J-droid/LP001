import { Metadata } from 'next';
import PneusPage from '../page';

export async function generateMetadata({ params }: { params: Promise<{ medida: string }> }): Promise<Metadata> {
  // Format: 205-55-r16
  const { medida } = await params;
  const parts = medida.split('-');
  const width = parts[0];
  const profile = parts[1];
  const rim = parts[2]?.replace('r', '');

  return {
    title: `Pneus ${width}/${profile} R${rim} | BRPNEU`,
    description: `Encontre pneus ${width}/${profile} R${rim} para diferentes veículos, marcas e faixas de preço.`,
  };
}

export default async function MedidaPage({
  params,
  searchParams,
}: {
  params: Promise<{ medida: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { medida } = await params;
  const resolvedSearchParams = await searchParams;
  const parts = medida.split('-');
  const width = parts[0];
  const profile = parts[1];
  const rim = parts[2]?.replace('r', '');

  // Inject the params into searchParams and delegate to the main catalog page
  const injectedSearchParams = {
    ...resolvedSearchParams,
    width,
    profile,
    rim,
  };

  return <PneusPage searchParams={Promise.resolve(injectedSearchParams)} />;
}
