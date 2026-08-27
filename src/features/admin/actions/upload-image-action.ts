'use server';

import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'Nenhum arquivo enviado.' };
    }

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Arquivo muito grande. O limite é 5MB.' };
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'O arquivo deve ser uma imagem.' };
    }

    const supabase = getSupabaseAdmin();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Falha ao fazer upload da imagem.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { 
      success: true, 
      url: publicUrlData.publicUrl 
    };
    
  } catch (error) {
    console.error('Server action upload error:', error);
    return { success: false, error: 'Erro inesperado no servidor.' };
  }
}
