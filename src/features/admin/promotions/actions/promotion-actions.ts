/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminPromotionsRepository } from '../repositories/admin-promotions-repository';
import { PromotionSchema, PromotionFormData } from '../schemas/promotion.schema';
import { revalidatePath } from 'next/cache';

export async function savePromotionAction(data: any, id?: string) {
  const supabase = await requireAdmin();
  const repo = new AdminPromotionsRepository(supabase);
  
  const parsed = PromotionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  
  try {
    if (id) {
      await repo.update(id, parsed.data);
    } else {
      await repo.create(parsed.data);
    }
    
    revalidatePath('/admin/promocoes');
    // Se o promotion engine estiver conectado no storefront, revalidaria '/' e '/pneus'
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') {
      return { error: 'Já existe uma promoção com este slug.' };
    }
    return { error: error.message };
  }
}

export async function togglePromotionStatusAction(id: string, isActive: boolean) {
  const supabase = await requireAdmin();
  const repo = new AdminPromotionsRepository(supabase);
  
  try {
    await repo.toggleActive(id, isActive);
    revalidatePath('/admin/promocoes');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

