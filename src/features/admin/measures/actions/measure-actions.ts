/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminMeasuresRepository } from '../repositories/admin-measures-repository';
import { MeasureSchema } from '../schemas/measure.schema';
import { revalidatePath } from 'next/cache';

export async function createMeasureAction(formData: FormData) {
  const supabase = await requireAdmin();
  const repo = new AdminMeasuresRepository(supabase);
  
  const rawData = {
    width: formData.get('width'),
    profile: formData.get('profile'),
    rim: formData.get('rim'),
  };
  
  const parsed = MeasureSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  
  try {
    await repo.create({
      width: parsed.data.width,
      profile: parsed.data.profile,
      rim: parsed.data.rim
    });
    
    // Revalida a lista de medidas e o formulário de produtos
    revalidatePath('/admin/medidas');
    revalidatePath('/admin/produtos/novo');
    revalidatePath('/admin/produtos/[id]/editar', 'page');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteMeasureAction(formData: FormData) {
  const supabase = await requireAdmin();
  const repo = new AdminMeasuresRepository(supabase);
  
  const id = formData.get('id') as string;
  if (!id) {
    return { error: 'ID inválido' };
  }
  
  try {
    await repo.delete(id);
    
    revalidatePath('/admin/medidas');
    revalidatePath('/admin/produtos/novo');
    revalidatePath('/admin/produtos/[id]/editar', 'page');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

