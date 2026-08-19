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
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const defaultValues = initialData ? {
    ...initialData,
    starts_at: initialData.starts_at ? new Date(initialData.starts_at).toISOString().slice(0, 16) : '',
    ends_at: initialData.ends_at ? new Date(initialData.ends_at).toISOString().slice(0, 16) : '',
  } : {
    is_active: true,
    position: 'home_hero',
    priority: 0,
    theme: 'dark',
    text_alignment: 'left',
    overlay_strength: 'medium',
    desktop_image_url: '/images/banners/banner-1-desktop.png',
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

  const watchValues = form.watch();

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit(data as unknown as BannerFormData))} className="space-y-8 pb-12">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm sticky top-20 z-10">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h2 className="text-xl font-bold">{initialData ? 'Editar Banner Premium' : 'Novo Banner Premium'}</h2>
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
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Imagens</h3>
            <div className="space-y-1">
              <label className="text-sm font-medium">Imagem Desktop (URL)</label>
              <input {...form.register('desktop_image_url')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: /images/banners/banner-1-desktop.png" />
              {form.formState.errors.desktop_image_url && <p className="text-xs text-red-500">{form.formState.errors.desktop_image_url.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Imagem Mobile (URL - Opcional)</label>
              <input {...form.register('mobile_image_url')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: /images/banners/banner-1-mobile.png" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Alt Text (Acessibilidade)</label>
              <input {...form.register('image_alt')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Descreva a imagem para leitores de tela" />
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Conteúdo e Textos</h3>
            <div className="space-y-1">
              <label className="text-sm font-medium">Título (Headline)</label>
              <input {...form.register('headline')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Texto Destacado (Highlight Text)</label>
              <input {...form.register('highlight_text')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Parte do título para ficar colorida" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Subtítulo</label>
              <input {...form.register('subheadline')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Alinhamento do Texto</label>
                <select {...form.register('text_alignment')} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="left">Esquerda</option>
                  <option value="center">Centralizado</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Tema (Cores do texto)</label>
                <select {...form.register('theme')} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="dark">Fundo Escuro (Texto Branco)</option>
                  <option value="light">Fundo Claro (Texto Preto)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Botões (CTAs)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">CTA Principal</label>
                <input {...form.register('primary_cta_label')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: VER OFERTAS" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Link do CTA Principal</label>
                <input {...form.register('primary_cta_url')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: /pneus" />
                {form.formState.errors.primary_cta_url && <p className="text-xs text-red-500">{form.formState.errors.primary_cta_url.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">CTA Secundário</label>
                <input {...form.register('secondary_cta_label')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: SABER MAIS" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Link do CTA Secundário</label>
                <input {...form.register('secondary_cta_url')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Exibição e Agendamento</h3>
            
            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium">Força do Overlay (Sombra na imagem)</label>
              <select {...form.register('overlay_strength')} className="w-full h-10 px-3 border rounded-md bg-background">
                <option value="none">Nenhum</option>
                <option value="light">Leve</option>
                <option value="medium">Médio</option>
                <option value="strong">Forte</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Agendar Início</label>
                <input type="datetime-local" {...form.register('starts_at')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Agendar Término</label>
                <input type="datetime-local" {...form.register('ends_at')} className="w-full h-10 px-3 border rounded-md bg-background" />
                {form.formState.errors.ends_at && <p className="text-xs text-red-500">{form.formState.errors.ends_at.message}</p>}
              </div>
            </div>

            <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors mt-4">
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
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h3 className="font-bold text-lg">Live Preview</h3>
            <div className="flex bg-muted rounded p-1">
              <button 
                type="button" 
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1 text-xs font-bold rounded ${previewDevice === 'desktop' ? 'bg-background shadow' : 'text-muted-foreground'}`}
              >
                Desktop
              </button>
              <button 
                type="button" 
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1 text-xs font-bold rounded ${previewDevice === 'mobile' ? 'bg-background shadow' : 'text-muted-foreground'}`}
              >
                Mobile
              </button>
            </div>
          </div>
          
          <div className="flex justify-center bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden py-4 border relative">
            <div 
              className={`relative bg-background overflow-hidden shadow-2xl transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-[90%] aspect-[21/9]' : 'w-[320px] h-[568px] mx-auto rounded-3xl border-8 border-black'
              }`}
            >
              {/* Image */}
              {((previewDevice === 'desktop' && watchValues.desktop_image_url) || (previewDevice === 'mobile' && (watchValues.mobile_image_url || watchValues.desktop_image_url))) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={previewDevice === 'mobile' ? (watchValues.mobile_image_url || watchValues.desktop_image_url) : watchValues.desktop_image_url} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">Sem imagem</div>
              )}
              
              {/* Overlay */}
              {watchValues.overlay_strength !== 'none' && (
                <div className={`absolute inset-0 z-10 pointer-events-none ${
                  watchValues.overlay_strength === 'light' ? 'bg-black/30' :
                  watchValues.overlay_strength === 'medium' ? 'bg-black/50' :
                  watchValues.overlay_strength === 'strong' ? 'bg-black/70' : ''
                } ${
                  watchValues.text_alignment === 'center' 
                    ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                    : 'bg-gradient-to-r from-black/90 via-black/40 to-transparent'
                }`} />
              )}
              
              {/* Content */}
              <div className={`relative z-20 w-full h-full flex flex-col justify-center p-6 md:p-12 ${
                watchValues.text_alignment === 'center' ? 'items-center text-center' : 'items-start text-left'
              }`}>
                <div className="max-w-2xl w-full">
                  {watchValues.headline && (
                    <h2 className={`text-2xl md:text-5xl font-black mb-4 leading-tight tracking-tight ${watchValues.theme === 'light' ? 'text-black' : 'text-white'}`}>
                      {watchValues.highlight_text ? (
                        <>
                          {watchValues.headline.split(watchValues.highlight_text).map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && <span className="text-primary">{watchValues.highlight_text}</span>}
                            </span>
                          ))}
                        </>
                      ) : (
                        watchValues.headline
                      )}
                    </h2>
                  )}
                  {watchValues.subheadline && (
                    <p className={`text-sm md:text-xl mb-8 max-w-lg ${watchValues.theme === 'light' ? 'text-gray-800' : 'text-gray-200'} drop-shadow`}>
                      {watchValues.subheadline}
                    </p>
                  )}
                  
                  <div className={`flex flex-col sm:flex-row gap-4 ${watchValues.text_alignment === 'center' ? 'justify-center' : ''}`}>
                    {watchValues.primary_cta_label && (
                      <div className="inline-flex items-center justify-center h-10 md:h-12 px-6 md:px-8 text-sm md:text-base font-bold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-lg cursor-pointer">
                        {watchValues.primary_cta_label}
                      </div>
                    )}
                    {watchValues.secondary_cta_label && (
                      <div className="inline-flex items-center justify-center h-10 md:h-12 px-6 md:px-8 text-sm md:text-base font-bold text-white border-2 border-white rounded-full hover:bg-white/10 transition-colors shadow-lg cursor-pointer">
                        {watchValues.secondary_cta_label}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">O preview é uma representação aproximada focada no posicionamento e estilos.</p>
        </div>

      </div>
    </form>
  );
}
