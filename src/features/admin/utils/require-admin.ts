import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Não autenticado');
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    throw new Error('Acesso restrito a administradores');
  }
  
  return supabase;
}
