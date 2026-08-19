import { Metadata } from 'next';
import PneusPage from '../page';

export async function generateMetadata({ params }: { params: { rim: string } }): Promise<Metadata> {
  return {
    title: `Pneus Aro ${params.rim} | TireStore`,
    description: `Encontre pneus aro ${params.rim} para diferentes veículos, marcas e faixas de preço.`,
  };
}

export default async function RimPage({
  params,
  searchParams,
}: {
  params: { rim: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const injectedSearchParams = {
    ...searchParams,
    rim: params.rim,
  };

  return <PneusPage searchParams={injectedSearchParams} />;
}
