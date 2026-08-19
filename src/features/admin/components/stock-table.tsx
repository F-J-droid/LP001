'use client';

import { useState } from 'react';
import { TireProduct } from '@/features/products/types';
import { updateInventory } from '@/features/admin/services/admin-service';
import { Check, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface StockTableProps {
  products: TireProduct[];
  lowStockThreshold: number;
}

export function StockTable({ products, lowStockThreshold }: StockTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (id: string, currentVal: number) => {
    setEditingId(id);
    setEditValue(currentVal);
  };

  const handleSave = async (productId: string) => {
    setIsSaving(true);
    try {
      await updateInventory(productId, editValue);
      setEditingId(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Erro ao salvar estoque: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
            <tr>
              <th className="px-4 py-3 w-16">Img</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Medida</th>
              <th className="px-4 py-3">Disponível</th>
              <th className="px-4 py-3">Reservado</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(product => {
              const available = product.stockQuantity ?? 0;
              const reserved = 0; // Mocked for now
              
              const isEditing = editingId === product.id;

              return (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 bg-white border rounded p-1 flex items-center justify-center">
                      <Image src={product.imageUrl} alt="" width={30} height={30} className="object-contain" />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium">{product.brand} {product.model}</td>
                  <td className="px-4 py-2 text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                    {product.width}/{product.profile} R{product.rim}
                  </td>
                  
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={e => setEditValue(parseInt(e.target.value) || 0)} 
                          className="w-20 h-8 px-2 border rounded text-center font-bold"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave(product.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button disabled={isSaving} onClick={() => handleSave(product.id)} className="p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                          <Check className="w-4 h-4" />
                        </button>
                        <button disabled={isSaving} onClick={() => setEditingId(null)} className="p-1.5 bg-muted text-muted-foreground rounded hover:bg-muted-foreground hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer font-bold w-20 h-8 flex items-center px-2 hover:bg-muted border border-transparent hover:border-input rounded transition-colors"
                        onClick={() => handleEdit(product.id, available)}
                      >
                        {available}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-2 text-muted-foreground">
                    {reserved}
                  </td>
                  
                  <td className="px-4 py-2">
                    {available <= 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                        Esgotado
                      </span>
                    ) : available <= lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Baixo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        Em Estoque
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
