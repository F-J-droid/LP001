import { Metadata } from 'next';
import PneusPage from '../page';

export async function generateMetadata({ params }: { params: Promise<{ rim: string }> }): Promise<Metadata> {
  const { rim } = await params;
  return {
    title: `Pneus Aro ${rim} | BRPNEU`,
    description: `Encontre pneus aro ${rim} para diferentes veículos, marcas e faixas de preço.`,
  };
}

export default async function RimPage({
  params,
  searchParams,
}: {
  params: Promise<{ rim: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { rim } = await params;
  const resolvedSearchParams = await searchParams;
  const injectedSearchParams = {
    ...resolvedSearchParams,
    rim,
  };

  return <PneusPage searchParams={Promise.resolve(injectedSearchParams)} />;
}
