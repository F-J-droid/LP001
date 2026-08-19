import { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { ProductCard } from '@/features/products/components/product-card';
import { productRepository } from '@/features/products/repositories/supabase-product-repository';
import { ProductSearchParams, ProductSortOption } from '@/features/products/repositories/product-repository';
import { CatalogSidebar } from '@/features/products/components/catalog-sidebar';
import { CatalogMobileFilters } from '@/features/products/components/catalog-mobile-filters';
import { CatalogSort } from '@/features/products/components/catalog-sort';
import { Pagination } from '@/components/ui/pagination'; // I will create this
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Catálogo de Pneus | TireStore',
  description: 'Encontre a medida certa para seu carro e compare as melhores opções de pneus.',
};

export default async function PneusPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const sort = (typeof searchParams.sort === 'string' ? searchParams.sort : 'relevance') as ProductSortOption;
  
  const params: ProductSearchParams = {
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    brand: typeof searchParams.brand === 'string' ? searchParams.brand : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    width: typeof searchParams.width === 'string' ? parseInt(searchParams.width) : undefined,
    profile: typeof searchParams.profile === 'string' ? parseInt(searchParams.profile) : undefined,
    rim: typeof searchParams.rim === 'string' ? parseInt(searchParams.rim) : undefined,
    minPrice: typeof searchParams.minPrice === 'string' ? parseInt(searchParams.minPrice) : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? parseInt(searchParams.maxPrice) : undefined,
  };

  const [paginatedProducts, brands, categories, rims] = await Promise.all([
    productRepository.searchProducts(params, sort, page, 12),
    productRepository.getAllBrands(),
    productRepository.getAllCategories(),
    productRepository.getAvailableRims(),
  ]);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Catalog Hero */}
      <div className="bg-[#0B1F33] text-white py-12 md:py-16">
        <Container>
          <div className="text-sm text-white/60 mb-6 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Pneus</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Pneus para todos os caminhos.</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Encontre a medida certa para seu carro e compare as melhores opções.
          </p>
        </Container>
      </div>

      <Section className="py-8">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24">
                <Suspense fallback={<div className="h-96 bg-card border border-muted rounded-xl p-6 animate-pulse" />}>
                  <CatalogSidebar 
                    brands={brands} 
                    categories={categories} 
                    rims={rims} 
                    currentParams={params} 
                  />
                </Suspense>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-card p-4 rounded-xl border border-muted shadow-sm">
                <div className="font-medium text-foreground">
                  <span className="font-bold">{paginatedProducts.total}</span> pneus encontrados
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Suspense fallback={<div className="h-10 w-24 bg-muted animate-pulse rounded-md" />}>
                    <CatalogMobileFilters 
                      brands={brands} 
                      categories={categories} 
                      rims={rims} 
                      currentParams={params}
                    />
                  </Suspense>
                  <div className="flex-1 sm:w-48">
                    <Suspense fallback={<div className="h-10 w-full bg-muted animate-pulse rounded-md" />}>
                      <CatalogSort currentSort={sort} />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Active Filters Summary could go here */}

              {/* Product Grid */}
              {paginatedProducts.total > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {paginatedProducts.data.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {paginatedProducts.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Suspense fallback={<div className="h-10 w-48 bg-muted animate-pulse rounded-md" />}>
                        <Pagination 
                          currentPage={paginatedProducts.page} 
                          totalPages={paginatedProducts.totalPages} 
                        />
                      </Suspense>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card rounded-2xl border border-dashed border-muted-foreground/30">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 text-foreground">Nenhum pneu encontrado.</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Não encontramos resultados para os filtros selecionados. Tente alterar os critérios ou faça uma nova busca.
                  </p>
                  <Link href="/pneus" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                    LIMPAR FILTROS
                  </Link>
                </div>
              )}
            </main>
          </div>
        </Container>
      </Section>
    </div>
  );
}
