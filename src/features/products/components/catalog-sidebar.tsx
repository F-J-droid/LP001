'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProductSearchParams } from '../repositories/product-repository';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { TireBrand, TireCategory } from '../types';

interface CatalogSidebarProps {
  brands: TireBrand[];
  categories: TireCategory[];
  rims: number[];
  currentParams: ProductSearchParams;
}

export function CatalogSidebar({ brands, categories, rims, currentParams }: CatalogSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page'); // Reset page when filtering
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    // If the same value is clicked, remove it (toggle off)
    const currentValue = searchParams.get(key);
    const newValue = currentValue === value ? '' : value;
    router.push(`${pathname}?${createQueryString(key, newValue)}`);
  };

  const clearFilters = () => {
    router.push(pathname); // Clears query string unless it's a dynamic route
  };

  const hasActiveFilters = Object.values(currentParams).some(v => v !== undefined && v !== '');

  return (
    <div className="bg-card border border-muted rounded-xl p-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xl text-foreground">Filtros</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2">
            LIMPAR
          </Button>
        )}
      </div>

      {/* Rims */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Aro</h3>
        <div className="flex flex-wrap gap-2">
          {rims.map(rim => {
            const isActive = currentParams.rim === rim;
            return (
              <Badge 
                key={rim} 
                variant={isActive ? 'default' : 'outline'}
                className={`cursor-pointer px-3 py-1 text-sm font-semibold hover:bg-primary/80 hover:text-primary-foreground transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:bg-muted'}`}
                onClick={() => handleFilterChange('rim', rim.toString())}
              >
                {rim}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Categoria</h3>
        <div className="space-y-2">
          {categories.map(cat => {
            const isActive = currentParams.category === cat.name;
            return (
              <div 
                key={cat.id} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleFilterChange('category', cat.name)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary text-white' : 'border-input group-hover:border-primary'}`}>
                  {isActive && <span className="text-xs font-bold">✓</span>}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Marca</h3>
        <div className="space-y-2">
          {brands.map(brand => {
            const isActive = currentParams.brand === brand.name;
            return (
              <div 
                key={brand.id} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleFilterChange('brand', brand.name)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary text-white' : 'border-input group-hover:border-primary'}`}>
                  {isActive && <span className="text-xs font-bold">✓</span>}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Ranges */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Preço</h3>
        <div className="space-y-2">
          {[
            { label: 'Até R$ 400', max: 400 },
            { label: 'R$ 400 — R$ 600', min: 400, max: 600 },
            { label: 'R$ 600 — R$ 800', min: 600, max: 800 },
            { label: 'Acima de R$ 800', min: 800 },
          ].map(range => {
            const isActive = currentParams.minPrice === range.min && currentParams.maxPrice === range.max;
            return (
              <div 
                key={range.label} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (isActive) {
                    params.delete('minPrice');
                    params.delete('maxPrice');
                  } else {
                    if (range.min) params.set('minPrice', range.min.toString()); else params.delete('minPrice');
                    if (range.max) params.set('maxPrice', range.max.toString()); else params.delete('maxPrice');
                  }
                  params.delete('page');
                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isActive ? 'border-primary' : 'border-input group-hover:border-primary'}`}>
                  {isActive && <div className="w-3 h-3 bg-primary rounded-full" />}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-foreground font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {range.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
