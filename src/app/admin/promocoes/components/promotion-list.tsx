'use client';

import { useTransition } from 'react';
import { Promotion, getPromotionStatus } from '@/features/admin/promotions/repositories/admin-promotions-repository';
import { Button } from '@/components/ui/button';
import { Edit, Power, PowerOff } from 'lucide-react';
import { togglePromotionStatusAction } from '@/features/admin/promotions/actions/promotion-actions';
import { toast } from 'sonner';
import Link from 'next/link';

export function PromotionList({ promotions }: { promotions: Promotion[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (promo: Promotion) => {
    const actionStr = promo.is_active ? 'desativar' : 'ativar';
    if (!confirm(`Deseja realmente ${actionStr} a promoção "${promo.name}"?`)) return;

    startTransition(async () => {
      const result = await togglePromotionStatusAction(promo.id, !promo.is_active);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Promoção ${promo.is_active ? 'desativada' : 'ativada'} com sucesso.`);
      }
    });
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 border rounded-lg text-muted-foreground">
        Nenhuma promoção cadastrada.
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'percentage': return 'Percentual (%)';
      case 'fixed_amount': return 'Valor Fixo (R$)';
      case 'fixed_price': return 'Preço Promocional';
      default: return type;
    }
  };

  const getStatusBadge = (promo: Promotion) => {
    const status = getPromotionStatus(promo);
    switch (status) {
      case 'active': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Ativa</span>;
      case 'scheduled': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">Agendada</span>;
      case 'expired': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Expirada</span>;
      case 'inactive': return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">Inativa</span>;
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Vigência</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 w-20 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {promotions.map(promo => (
              <tr key={promo.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-bold">{promo.name}<br/><span className="text-xs text-muted-foreground font-normal">{promo.slug}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{getTypeLabel(promo.type)}</td>
                <td className="px-4 py-3 font-medium">
                  {promo.type === 'percentage' ? `${promo.value}%` : `R$ ${promo.value.toFixed(2)}`}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(promo.starts_at).toLocaleDateString()}<br/>
                  até {new Date(promo.ends_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(promo)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/promocoes/${promo.id}/editar`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${promo.is_active ? 'text-destructive hover:text-destructive/90 hover:bg-destructive/10' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                      onClick={() => handleToggle(promo)}
                      disabled={isPending}
                      title={promo.is_active ? "Desativar" : "Ativar"}
                    >
                      {promo.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
