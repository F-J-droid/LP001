import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function makeAdmin(email) {
  console.log(`Buscando usuário: ${email}`);
  
  // Como admin, podemos listar usuários
  const { data: { users }, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
  if (fetchError) {
    console.error('Erro ao listar usuários:', fetchError);
    return;
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error(`Usuário ${email} não encontrado no Supabase Auth.`);
    console.log("Usuários existentes:");
    users.forEach(u => console.log(`- ${u.email}`));
    return;
  }
  
  console.log(`Usuário encontrado. ID: ${user.id}`);
  
  // Atualizando a tabela profiles
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id);
    
  if (updateError) {
    console.error('Erro ao atualizar role na tabela profiles:', updateError);
    return;
  }
  
  console.log('✅ Permissão de admin concedida com sucesso na tabela profiles!');
  
  // Vamos também checar se há algo no raw_user_meta_data que precise ser atualizado
  const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role: 'admin' }
  });
  
  if (metaError) {
    console.warn('Nota: falha ao atualizar user_metadata (não crítico se a tabela profiles atualizou):', metaError);
  } else {
    console.log('✅ Metadata atualizada.');
  }
}

makeAdmin('0536767880a@gmail.com');
