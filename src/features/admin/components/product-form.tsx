'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '../schemas/product.schema';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TireProduct, TireBadge } from '@/features/products/types';
import { createAdminProduct, updateAdminProduct, updateInventory } from '../services/admin-service';
import { Save, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';

interface ProductFormProps {
  initialData?: TireProduct & { stockQuantity?: number };
  availableMeasures?: { id?: string, width: number, profile: number, rim: number }[];
}

export function ProductForm({ initialData, availableMeasures = [] }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<ProductFormData> = initialData ? {
    ...initialData,
    badgeOferta: initialData.badges?.includes('Oferta') || false,
    badgeMaisVendido: initialData.badges?.includes('Mais vendido') || false,
    badgeLancamento: initialData.badges?.includes('Lançamento') || false,
    stockQuantity: initialData.stockQuantity || 0
  } : {
    isActive: true,
    runFlat: false,
    reinforced: false,
    badgeOferta: false,
    badgeMaisVendido: false,
    badgeLancamento: false,
    imageUrl: '/images/products/tire-touring.webp', // Default demo image
    stockQuantity: 10
  };

  const form = useForm<ProductFormData>({
    // @ts-expect-error - zodResolver type mismatch
    resolver: zodResolver(productSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const badges: TireBadge[] = [];
      if (data.badgeOferta) badges.push('Oferta');
      if (data.badgeMaisVendido) badges.push('Mais vendido');
      if (data.badgeLancamento) badges.push('Lançamento');

      const productId = initialData?.id || crypto.randomUUID();

      const productPayload: Partial<TireProduct> = {
        id: productId,
        slug: data.slug,
        sku: data.sku,
        ean: data.ean,
        brand: data.brand,
        model: data.model,
        width: data.width,
        profile: data.profile,
        rim: data.rim,
        loadIndex: data.loadIndex,
        speedIndex: data.speedIndex,
        vehicleType: data.vehicleType,
        runFlat: data.runFlat,
        reinforced: data.reinforced,
        price: data.price,
        promotionalPrice: data.promotionalPrice,
        pixPrice: data.pixPrice || (data.promotionalPrice || data.price) * 0.9,
        stockStatus: data.stockQuantity > 0 ? 'available' : 'out_of_stock',
        imageUrl: data.imageUrl,
        badges,
        description: data.description,
        isActive: data.isActive,
        inmetroCode: data.inmetroCode,
        efficiency: data.efficiency,
        wetGrip: data.wetGrip,
        externalNoiseDb: data.externalNoiseDb,
      };

      if (initialData) {
        await updateAdminProduct(productId, productPayload);
        await updateInventory(productId, data.stockQuantity);
      } else {
        await createAdminProduct(productPayload as TireProduct);
        await updateInventory(productId, data.stockQuantity);
      }

      router.push('/admin/produtos');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageUrlValue = form.watch('imageUrl');

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit(data as unknown as ProductFormData))} className="space-y-8 pb-12">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm sticky top-20 z-10">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h2 className="text-xl font-bold">{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Info Básica */}
          <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Marca</label>
                <input {...form.register('brand')} className="w-full h-10 px-3 border rounded-md bg-background" />
                {form.formState.errors.brand && <p className="text-xs text-red-500">{form.formState.errors.brand.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Modelo</label>
                <input {...form.register('model')} className="w-full h-10 px-3 border rounded-md bg-background" />
                {form.formState.errors.model && <p className="text-xs text-red-500">{form.formState.errors.model.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">SKU</label>
                <input {...form.register('sku')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Slug (URL)</label>
                <input {...form.register('slug')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">EAN</label>
                <input {...form.register('ean')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Categoria do Veículo</label>
                <select {...form.register('vehicleType')} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="Passeio">Passeio</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Utilitário">Utilitário</option>
                  <option value="4x4">4x4</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Descrição</label>
                <textarea {...form.register('description')} className="w-full p-3 border rounded-md bg-background min-h-[100px]" />
              </div>
            </div>
          </div>

          {/* Medida */}
          <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Medida e Especificações</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 space-y-1">
                <label className="text-sm font-medium">Medida (Cadastrada no Módulo de Medidas)</label>
                <select 
                  className="w-full h-10 px-3 border rounded-md bg-background"
                  defaultValue={initialData ? `${initialData.width}|${initialData.profile}|${initialData.rim}` : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const [w, p, r] = val.split('|').map(Number);
                      form.setValue('width', w);
                      form.setValue('profile', p);
                      form.setValue('rim', r);
                    }
                  }}
                >
                  <option value="" disabled>Selecione uma medida...</option>
                  {availableMeasures.map(m => (
                    <option key={`${m.width}|${m.profile}|${m.rim}`} value={`${m.width}|${m.profile}|${m.rim}`}>
                      {m.width}/{m.profile} R{m.rim}
                    </option>
                  ))}
                </select>
                {/* Hidden inputs to keep react-hook-form happy */}
                <input type="hidden" {...form.register('width', { valueAsNumber: true })} />
                <input type="hidden" {...form.register('profile', { valueAsNumber: true })} />
                <input type="hidden" {...form.register('rim', { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Índ. Carga</label>
                <input {...form.register('loadIndex')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Índ. Vel.</label>
                <input {...form.register('speedIndex')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
            </div>
            
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register('runFlat')} className="w-4 h-4" />
                <span className="text-sm font-medium">Run Flat</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register('reinforced')} className="w-4 h-4" />
                <span className="text-sm font-medium">Reforçado</span>
              </label>
            </div>
          </div>

          {/* INMETRO */}
          <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Selo INMETRO</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Código Registro</label>
                <input {...form.register('inmetroCode')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Ruído (dB)</label>
                <input type="number" {...form.register('externalNoiseDb')} className="w-full h-10 px-3 border rounded-md bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Resistência ao rolamento</label>
                <select {...form.register('efficiency')} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="">Não informado</option>
                  {['A','B','C','D','E','F','G'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Aderência no molhado</label>
                <select {...form.register('wetGrip')} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="">Não informado</option>
                  {['A','B','C','D','E','F','G'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pricing */}
          <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Preço e Estoque</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Preço Regular (R$)</label>
                <input type="number" step="0.01" {...form.register('price')} className="w-full h-10 px-3 border rounded-md bg-background" />
                {form.formState.errors.price && <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-green-600">Preço Promocional (Opcional)</label>
                <input type="number" step="0.01" {...form.register('promotionalPrice')} className="w-full h-10 px-3 border rounded-md bg-background border-green-500/50" />
                {form.formState.errors.promotionalPrice && <p className="text-xs text-red-500">{form.formState.errors.promotionalPrice.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Preço PIX Específico (Opcional)</label>
                <input type="number" step="0.01" {...form.register('pixPrice')} className="w-full h-10 px-3 border rounded-md bg-background text-muted-foreground" placeholder="Calculado auto se vazio" />
              </div>
              
              <div className="pt-4 border-t space-y-1">
                <label className="text-sm font-medium font-bold">Estoque Disponível</label>
                <input type="number" {...form.register('stockQuantity')} className="w-full h-10 px-3 border-2 border-primary/20 rounded-md bg-background text-lg font-bold" />
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Imagem Principal</h3>
            <div className="space-y-1">
              <label className="text-sm font-medium">Upload ou URL da Imagem</label>
              <ImageUpload 
                value={imageUrlValue}
                onChange={(url) => form.setValue('imageUrl', url, { shouldValidate: true })}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-2">A URL também pode ser preenchida diretamente se desejar, basta editar o valor no formulário se não utilizar o upload.</p>
              {/* Oculto, mas ainda registramos no react-hook-form se precisar de bind direto */}
              <input type="hidden" {...form.register('imageUrl')} />
            </div>
          </div>

          {/* Status & Badges */}
          <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg border-b pb-2">Status e Badges</h3>
            <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
              <div>
                <span className="font-bold block">Produto Ativo</span>
                <span className="text-xs text-muted-foreground">Exibir no catálogo público</span>
              </div>
              <input type="checkbox" {...form.register('isActive')} className="w-5 h-5 accent-primary" />
            </label>
            
            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...form.register('badgeOferta')} className="w-4 h-4" />
                <span className="text-sm font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold">Oferta</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...form.register('badgeMaisVendido')} className="w-4 h-4" />
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">Mais Vendido</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...form.register('badgeLancamento')} className="w-4 h-4" />
                <span className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-bold">Lançamento</span>
              </label>
            </div>
          </div>
          
        </div>
      </div>
    </form>
  );
}
