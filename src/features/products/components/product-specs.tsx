'use client';

import { useState } from 'react';
import { TireProduct } from '../types';
import Link from 'next/link';

export function ProductSpecs({ product }: { product: TireProduct }) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'inmetro' | 'compat'>('desc');

  const tabs = [
    { id: 'desc', label: 'Descrição' },
    { id: 'specs', label: 'Ficha Técnica' },
    { id: 'inmetro', label: 'Etiqueta INMETRO' },
    { id: 'compat', label: 'Compatibilidade' },
  ] as const;

  return (
    <div className="py-12">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-muted scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="py-8">
        {activeTab === 'desc' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-black text-foreground">Sobre o {product.model}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description || 'Descrição não disponível para este produto.'}
            </p>
            
            {/* Guide */}
            <div className="mt-8 p-6 bg-muted/30 rounded-2xl border border-muted flex items-center justify-between gap-6 flex-wrap">
              <div>
                <h3 className="font-bold text-lg mb-2">Entendendo a medida {product.width}/{product.profile} R{product.rim}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>{product.width}</strong>: Largura nominal em mm</li>
                  <li><strong>{product.profile}</strong>: Perfil (relação percentual altura/largura)</li>
                  <li><strong>R{product.rim}</strong>: Aro (diâmetro interno em polegadas)</li>
                </ul>
              </div>
              <Link href="/pneus" className="text-primary font-bold text-sm hover:underline">
                VER GUIA COMPLETO
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-black text-foreground mb-6">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 border-t border-muted">
              {[
                { label: 'Marca', value: product.brand },
                { label: 'Modelo', value: product.model },
                { label: 'Medida', value: `${product.width}/${product.profile} R${product.rim}` },
                { label: 'Largura', value: `${product.width} mm` },
                { label: 'Perfil', value: `${product.profile}%` },
                { label: 'Aro', value: `${product.rim}"` },
                { label: 'Índice de carga', value: product.loadIndex },
                { label: 'Índice de velocidade', value: product.speedIndex },
                { label: 'Tipo de veículo', value: product.vehicleType },
                { label: 'Garantia', value: `${product.warrantyMonths} meses` },
                { label: 'EAN', value: product.ean || 'Não informado' },
                { label: 'SKU', value: product.sku },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-muted">
                  <span className="text-muted-foreground font-medium">{spec.label}</span>
                  <span className="font-bold text-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inmetro' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-foreground mb-6">Desempenho e Etiqueta</h2>
            {product.inmetroCode ? (
              <div className="bg-white border-2 border-muted rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 w-full">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-bold text-muted-foreground">Eficiência Energética</span>
                    <span className="text-2xl font-black text-primary">{product.efficiency}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-bold text-muted-foreground">Aderência no Molhado</span>
                    <span className="text-2xl font-black text-primary">{product.wetGrip}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-bold text-muted-foreground">Ruído Externo</span>
                    <span className="text-2xl font-black text-primary">{product.externalNoiseDb} dB</span>
                  </div>
                  <div className="pt-2 text-sm text-muted-foreground font-medium text-center md:text-left">
                    Registro INMETRO: {product.inmetroCode}
                  </div>
                </div>
                
                <div className="w-32 h-40 bg-muted/20 border-2 border-dashed border-muted flex items-center justify-center rounded-xl shrink-0 text-center text-muted-foreground text-xs font-bold p-4">
                  (Representação visual Inmetro)
                </div>
              </div>
            ) : (
              <div className="p-8 bg-muted/20 border border-muted rounded-2xl text-center">
                <p className="text-muted-foreground font-medium">Informações de INMETRO não disponíveis para este produto.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compat' && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-black text-foreground mb-6">Compatibilidade</h2>
            <div className="p-8 bg-[#0B1F33] rounded-3xl text-white flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="space-y-3">
                <h3 className="text-xl font-bold">Serve no meu carro?</h3>
                <p className="text-white/70">
                  A compatibilidade de pneus depende da versão e configuração original do seu veículo.
                  Consulte a medida correta no manual do proprietário ou na lateral da porta.
                </p>
              </div>
              <Link href="/?mode=vehicle">
                <button className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-xl whitespace-nowrap transition-transform hover:-translate-y-1">
                  BUSCAR POR VEÍCULO
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
