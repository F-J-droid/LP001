/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PromotionSchema, PromotionFormData } from '@/features/admin/promotions/schemas/promotion.schema';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { savePromotionAction } from '@/features/admin/promotions/actions/promotion-actions';
import { Save, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PromotionFormProps {
  initialData?: any;
}

export function PromotionForm({ initialData }: PromotionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = initialData ? {
    ...initialData,
    starts_at: new Date(initialData.starts_at).toISOString().slice(0, 16),
    ends_at: new Date(initialData.ends_at).toISOString().slice(0, 16),
  } : {
    type: 'percentage',
    value: 0,
    is_active: true,
    starts_at: '',
    ends_at: '',
  };

  const form = useForm<PromotionFormData>({
    // @ts-expect-error - zodResolver type mismatch
    resolver: zodResolver(PromotionSchema),
    defaultValues
  });

  const onSubmit = async (data: PromotionFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        starts_at: new Date(data.starts_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString()
      };

      const result = await savePromotionAction(payload, initialData?.id);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? 'Promoção atualizada.' : 'Promoção criada.');
        router.push('/admin/promocoes');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit(data as unknown as PromotionFormData))} className="space-y-8 pb-12">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm sticky top-20 z-10">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h2 className="text-xl font-bold">{initialData ? 'Editar Promoção' : 'Nova Promoção'}</h2>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="max-w-2xl bg-card border rounded-xl p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nome da Promoção</label>
            <input {...form.register('name')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: Black Friday 2026" />
            {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Slug (Identificador único)</label>
            <input {...form.register('slug')} className="w-full h-10 px-3 border rounded-md bg-background" placeholder="Ex: black-friday-2026" />
            {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de Desconto</label>
            <select {...form.register('type')} className="w-full h-10 px-3 border rounded-md bg-background">
              <option value="percentage">Percentual (%)</option>
              <option value="fixed_amount">Valor Fixo (R$)</option>
              <option value="fixed_price">Preço Promocional Exato (R$)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Valor</label>
            <input type="number" step="0.01" {...form.register('value')} className="w-full h-10 px-3 border rounded-md bg-background" />
            {form.formState.errors.value && <p className="text-xs text-red-500">{form.formState.errors.value.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Início</label>
            <input type="datetime-local" {...form.register('starts_at')} className="w-full h-10 px-3 border rounded-md bg-background" />
            {form.formState.errors.starts_at && <p className="text-xs text-red-500">{form.formState.errors.starts_at.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Término</label>
            <input type="datetime-local" {...form.register('ends_at')} className="w-full h-10 px-3 border rounded-md bg-background" />
            {form.formState.errors.ends_at && <p className="text-xs text-red-500">{form.formState.errors.ends_at.message}</p>}
          </div>
        </div>

        <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
          <div>
            <span className="font-bold block">Promoção Ativa</span>
            <span className="text-xs text-muted-foreground">Promoções inativas não são aplicadas, mesmo no prazo.</span>
          </div>
          <input type="checkbox" {...form.register('is_active')} className="w-5 h-5 accent-primary" />
        </label>
      </div>
    </form>
  );
}

