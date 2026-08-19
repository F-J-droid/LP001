'use client';

import { useState, useTransition } from 'react';
import { TireSize } from '@/features/admin/measures/repositories/admin-measures-repository';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteMeasureAction } from '@/features/admin/measures/actions/measure-actions';
import { toast } from 'sonner';

export function MeasureList({ measures }: { measures: TireSize[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, usageCount: number) => {
    if (usageCount > 0) {
      toast.error('Esta medida está em uso e não pode ser removida.');
      return;
    }
    
    if (!confirm('Deseja realmente remover esta medida?')) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id);
      
      const result = await deleteMeasureAction(formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Medida removida.');
      }
    });
  };

  if (measures.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 border rounded-lg text-muted-foreground">
        Nenhuma medida cadastrada.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
            <tr>
              <th className="px-4 py-3">Exibição</th>
              <th className="px-4 py-3 text-center">Largura</th>
              <th className="px-4 py-3 text-center">Perfil</th>
              <th className="px-4 py-3 text-center">Aro</th>
              <th className="px-4 py-3 text-center">Produtos Associados</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {measures.map(m => (
              <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-bold text-lg">{m.width}/{m.profile} R{m.rim}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">{m.width}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">{m.profile}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">R{m.rim}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {m.usageCount}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => handleDelete(m.id, m.usageCount || 0)}
                    disabled={isPending || (m.usageCount || 0) > 0}
                    title={(m.usageCount || 0) > 0 ? "Medida em uso" : "Remover"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
