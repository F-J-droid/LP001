'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CatalogSidebar } from './catalog-sidebar';
import { ProductSearchParams } from '../repositories/product-repository';

import { TireBrand, TireCategory } from '../types';

interface CatalogMobileFiltersProps {
  brands: TireBrand[];
  categories: TireCategory[];
  rims: number[];
  currentParams: ProductSearchParams;
}

export function CatalogMobileFilters({ brands, categories, rims, currentParams }: CatalogMobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(currentParams).filter(v => v !== undefined && v !== '').length;

  return (
    <div className="lg:hidden w-full sm:w-auto">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="w-full h-10 font-bold border-muted"
      >
        FILTRAR {activeCount > 0 && `(${activeCount})`}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-sm h-full bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-card">
              <h2 className="font-black text-xl">Filtros</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0 rounded-full">
                ✕
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <CatalogSidebar 
                brands={brands} 
                categories={categories} 
                rims={rims} 
                currentParams={currentParams} 
              />
            </div>
            
            <div className="p-4 border-t bg-card">
              <Button className="w-full font-bold h-12" onClick={() => setIsOpen(false)}>
                VER RESULTADOS
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
