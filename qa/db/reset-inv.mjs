import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetInv() {
  await supabase.from('inventory').update({ quantity: 100, reserved_quantity: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Inventário resetado para 100 em todos os itens!');
}

resetInv();
