import { TireProduct } from '../types';
import { ProductCard } from './product-card';
import Link from 'next/link';

export function ProductSimilar({ products, measure }: { products: TireProduct[], measure: string }) {
  if (!products.length) return null;

  return (
    <div className="py-12">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight uppercase">Outras opções</h2>
          <p className="text-muted-foreground font-medium mt-1">Recomendações similares em {measure}</p>
        </div>
        <Link href={`/pneus?width=${products[0].width}&profile=${products[0].profile}&rim=${products[0].rim}`} className="text-primary font-bold hover:underline shrink-0 text-sm">
          VER TODAS OPÇÕES
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
