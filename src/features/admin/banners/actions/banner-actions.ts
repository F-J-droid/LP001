/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminBannersRepository } from '../repositories/admin-banners-repository';
import { BannerSchema } from '../schemas/banner.schema';
import { revalidatePath } from 'next/cache';

export async function saveBannerAction(data: any, id?: string) {
  const supabase = await requireAdmin();
  const repo = new AdminBannersRepository(supabase);
  
  const parsed = BannerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  
  try {
    if (id) {
      await repo.update(id, parsed.data);
    } else {
      await repo.create(parsed.data);
    }
    
    revalidatePath('/admin/banners');
    revalidatePath('/'); // Revalida a Home
    revalidatePath('/pneus'); // Revalida o catálogo
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function toggleBannerStatusAction(id: string, isActive: boolean) {
  const supabase = await requireAdmin();
  const repo = new AdminBannersRepository(supabase);
  
  try {
    await repo.toggleActive(id, isActive);
    revalidatePath('/admin/banners');
    revalidatePath('/');
    revalidatePath('/pneus');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteBannerAction(id: string) {
  const supabase = await requireAdmin();
  const repo = new AdminBannersRepository(supabase);
  
  try {
    await repo.delete(id);
    revalidatePath('/admin/banners');
    revalidatePath('/');
    revalidatePath('/pneus');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

