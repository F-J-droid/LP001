'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createMeasureAction } from '@/features/admin/measures/actions/measure-actions';
import { toast } from 'sonner';

export function MeasureForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createMeasureAction(formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Medida cadastrada.');
        form.reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 border rounded-xl shadow-sm">
      <div className="grid grid-cols-3 gap-4 flex-1">
        <div className="space-y-1">
          <label htmlFor="width" className="text-sm font-medium">Largura (mm)</label>
          <Input id="width" name="width" type="number" min="1" placeholder="Ex: 205" required disabled={isPending} />
        </div>
        <div className="space-y-1">
          <label htmlFor="profile" className="text-sm font-medium">Perfil (%)</label>
          <Input id="profile" name="profile" type="number" min="1" placeholder="Ex: 55" required disabled={isPending} />
        </div>
        <div className="space-y-1">
          <label htmlFor="rim" className="text-sm font-medium">Aro (polegadas)</label>
          <Input id="rim" name="rim" type="number" min="1" placeholder="Ex: 16" required disabled={isPending} />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto shrink-0">
        {isPending ? 'Adicionando...' : 'Adicionar Medida'}
      </Button>
    </form>
  );
}
