/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminSettingsRepository } from '../repositories/admin-settings-repository';
import { 
  StoreInfoSettingsSchema, 
  ContactSettingsSchema, 
  SocialMediaSettingsSchema, 
  CommerceSettingsSchema, 
  SeoSettingsSchema 
} from '../schemas/settings.schema';
import { revalidatePath } from 'next/cache';

const schemas: Record<string, any> = {
  store_info: StoreInfoSettingsSchema,
  contact: ContactSettingsSchema,
  social_media: SocialMediaSettingsSchema,
  commerce: CommerceSettingsSchema,
  seo: SeoSettingsSchema,
};

export async function saveSettingsSectionAction(sectionKey: string, data: any) {
  const supabase = await requireAdmin();
  const repo = new AdminSettingsRepository(supabase);
  
  const schema = schemas[sectionKey];
  if (!schema) {
    return { error: 'Seção inválida.' };
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  
  try {
    await repo.updateSection(sectionKey, parsed.data);
    
    // Revalida a aplicação inteira para garantir que as configs reflitam em todo lugar (layout, footer, seo, etc)
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

