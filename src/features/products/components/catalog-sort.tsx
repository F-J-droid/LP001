'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/select';

export function CatalogSort({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentSort} onChange={handleSort} className="w-full bg-card h-10 border-muted">
      <option value="relevance">Mais relevantes</option>
      <option value="price_asc">Menor preço</option>
      <option value="price_desc">Maior preço</option>
      <option value="best_seller">Mais vendidos</option>
      <option value="best_rated">Melhor avaliados</option>
      <option value="newest">Novidades</option>
    </Select>
  );
}
