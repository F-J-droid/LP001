/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BannerSchema, BannerFormData } from '@/features/admin/banners/schemas/banner.schema';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { saveBannerAction } from '@/features/admin/banners/actions/banner-actions';
import { Save, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BannerFormProps {
  initialData?: any;
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = initialData ? {
    ...initialData,
    starts_at: initialData.starts_at ? new Date(initialData.starts_at).toISOString().slice(0, 16) : '',
    ends_at: initialData.ends_at ? new Date(initialData.ends_at).toISOString().slice(0, 16) : '',
  } : {
    is_active: true,
    position: 'home_hero',
    priority: 0,
    image_url: '/images/banners/hero-1.jpg',
  };

  const form = useForm<BannerFormData>({
    // @ts-expect-error - zodResolver type mismatch
    resolver: zodResolver(BannerSchema),
    defaultValues
  });

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : null,
        ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : null,
      };

      const result = await saveBannerAction(payload, initialData?.id);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? 'Banner atualizado.' : 'Banner criado.');
        router.push('/admin/banners');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchImageUrl = form.watch('image_url');
  const watchHeadline = form.watch('headline');
  const watchSubheadline = form.watch('subheadline');
  const watchCtaLabel = form.watch('cta_label');

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit(data as unknown as BannerFormData))} className="space-y-8 pb-12">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm sticky top-20 z-10">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h2 className="text-xl font-bold">{initialData ? 'Editar Banner' : 'Novo Banner'}</h2>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Informações do Banner</h3>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome Interno</label>
              <input {...form.register('internal_name')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: Campanha Dia dos Pais" />
              {form.formState.errors.internal_name && <p className="text-xs text-red-500">{form.formState.errors.internal_name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Posição</label>
                <select {...form.register('position')} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="home_hero">Home Hero Principal</option>
                  <option value="home_promo_1">Home Promo 1</option>
                  <option value="home_promo_2">Home Promo 2</option>
                  <option value="catalog_banner">Catálogo (Topo)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Prioridade (0 = menor)</label>
                <input type="number" {...form.register('priority')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">URL da Imagem</label>
              <input {...form.register('image_url')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: /images/banners/hero-1.jpg" />
              {form.formState.errors.image_url && <p className="text-xs text-red-500">{form.formState.errors.image_url.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">Nesta versão, utilize URLs locais ou externas diretas. O upload direto no banco ainda não foi configurado.</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Título (Headline - Opcional)</label>
              <input {...form.register('headline')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Subtítulo (Opcional)</label>
              <input {...form.register('subheadline')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Texto do Botão (CTA)</label>
                <input {...form.register('cta_label')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Link do Botão</label>
                <input {...form.register('cta_url')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: /pneus" />
                {form.formState.errors.cta_url && <p className="text-xs text-red-500">{form.formState.errors.cta_url.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Agendar Início (Opcional)</label>
                <input type="datetime-local" {...form.register('starts_at')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Agendar Término (Opcional)</label>
                <input type="datetime-local" {...form.register('ends_at')} className="w-full h-10 px-3 border rounded-md bg-background" />
                {form.formState.errors.ends_at && <p className="text-xs text-red-500">{form.formState.errors.ends_at.message}</p>}
              </div>
            </div>

            <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
              <div>
                <span className="font-bold block">Banner Ativo</span>
                <span className="text-xs text-muted-foreground">Desmarque para ocultar imediatamente.</span>
              </div>
              <input type="checkbox" {...form.register('is_active')} className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-40">
          <h3 className="font-bold text-lg border-b pb-2 mb-4">Preview do Banner</h3>
          
          <div className="relative w-full aspect-[21/9] bg-muted rounded-xl overflow-hidden shadow-inner flex items-center justify-center border">
            {watchImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={watchImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="text-muted-foreground z-10 relative">Sem imagem</span>
            )}
            
            {/* Overlay Gradient for readability */}
            {(watchHeadline || watchSubheadline || watchCtaLabel) && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
            )}
            
            <div className="relative z-20 w-full h-full p-8 flex flex-col justify-center max-w-xl text-white">
              {watchHeadline && (
                <h2 className="text-3xl md:text-4xl font-black mb-2 text-white drop-shadow-md">
                  {watchHeadline}
                </h2>
              )}
              {watchSubheadline && (
                <p className="text-lg md:text-xl text-gray-200 drop-shadow-md mb-6 max-w-md">
                  {watchSubheadline}
                </p>
              )}
              {watchCtaLabel && (
                <div>
                  <div className="inline-flex items-center justify-center h-12 px-8 font-bold text-black bg-white rounded-full shadow-lg">
                    {watchCtaLabel}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">O preview é uma representação aproximada. O visual final pode variar conforme o dispositivo do usuário.</p>
        </div>

      </div>
    </form>
  );
}

