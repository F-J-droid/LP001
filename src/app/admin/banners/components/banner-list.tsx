'use client';

import { useTransition } from 'react';
import { Banner } from '@/features/admin/banners/repositories/admin-banners-repository';
import { Button } from '@/components/ui/button';
import { Edit, Power, PowerOff, Trash2, Copy } from 'lucide-react';
import { toggleBannerStatusAction, deleteBannerAction } from '@/features/admin/banners/actions/banner-actions';
import { toast } from 'sonner';
import Link from 'next/link';

export function BannerList({ banners }: { banners: Banner[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (banner: Banner) => {
    const actionStr = banner.is_active ? 'desativar' : 'ativar';
    if (!confirm(`Deseja realmente ${actionStr} o banner "${banner.internal_name}"?`)) return;

    startTransition(async () => {
      const result = await toggleBannerStatusAction(banner.id, !banner.is_active);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Banner ${banner.is_active ? 'desativado' : 'ativado'} com sucesso.`);
      }
    });
  };

  const handleDelete = (banner: Banner) => {
    if (!confirm(`Deseja realmente DELETAR permanentemente o banner "${banner.internal_name}"?`)) return;

    startTransition(async () => {
      const result = await deleteBannerAction(banner.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Banner deletado com sucesso.`);
      }
    });
  };

  const handleDuplicate = (banner: Banner) => {
    if (!confirm(`Deseja duplicar o banner "${banner.internal_name}"?`)) return;

    startTransition(async () => {
      const { id, created_at, updated_at, ...rest } = banner;
      const { saveBannerAction } = await import('@/features/admin/banners/actions/banner-actions');
      const payload = {
        ...rest,
        internal_name: `${rest.internal_name} (Cópia)`,
        is_active: false
      };
      const result = await saveBannerAction(payload);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Banner duplicado com sucesso.`);
      }
    });
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 border rounded-lg text-muted-foreground">
        Nenhum banner cadastrado.
      </div>
    );
  }

  const getPositionLabel = (pos: string) => {
    const map: Record<string, string> = {
      'home_hero': 'Home Hero Principal',
      'home_promo_1': 'Home Promo 1',
      'home_promo_2': 'Home Promo 2',
      'catalog_banner': 'Catálogo (Topo)'
    };
    return map[pos] || pos;
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
            <tr>
              <th className="px-4 py-3 w-32">Preview</th>
              <th className="px-4 py-3">Nome Interno</th>
              <th className="px-4 py-3">Posição</th>
              <th className="px-4 py-3 text-center">Prioridade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 w-28 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {banners.map(banner => (
              <tr key={banner.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-24 h-12 bg-muted rounded overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={banner.desktop_image_url} alt={banner.image_alt || "Preview"} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-bold">
                  {banner.internal_name}
                  {banner.headline && <div className="text-xs text-muted-foreground font-normal mt-1">{banner.headline}</div>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{getPositionLabel(banner.position)}</td>
                <td className="px-4 py-3 font-medium text-center">{banner.priority}</td>
                <td className="px-4 py-3">
                  {banner.is_active ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Ativo</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">Inativo</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/banners/${banner.id}/editar`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${banner.is_active ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                      onClick={() => handleToggle(banner)}
                      disabled={isPending}
                      title={banner.is_active ? "Desativar" : "Ativar"}
                    >
                      {banner.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      onClick={() => handleDuplicate(banner)}
                      disabled={isPending}
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleDelete(banner)}
                      disabled={isPending}
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
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
