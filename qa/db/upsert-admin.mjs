import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function upsertAdmin(email) {
  console.log(`Buscando usuário: ${email}`);
  
  const { data: { users }, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
  if (fetchError) {
    console.error('Erro ao listar usuários:', fetchError);
    return;
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error(`Usuário não encontrado no Supabase Auth.`);
    return;
  }
  
  console.log(`Usuário encontrado. ID: ${user.id}`);
  
  // Use UPSERT para criar ou atualizar o profile do usuário
  const { error: upsertError } = await supabaseAdmin
    .from('profiles')
    .upsert({ 
      id: user.id, 
      role: 'superadmin',
      updated_at: new Date().toISOString()
    });
    
  if (upsertError) {
    console.error('Erro ao fazer upsert na tabela profiles:', upsertError);
    return;
  }
  
  console.log('✅ Registro na tabela profiles criado/atualizado com role superadmin!');
}

upsertAdmin('0536767880a@gmail.com');
