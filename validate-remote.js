import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("--- 4. VALIDAR TABELAS REMOTAS E 5. VALIDAR DADOS ---");
  const tables = [
    'profiles', 'tire_brands', 'tire_models', 'tire_sizes', 'tire_variants',
    'categories', 'product_categories', 'product_images', 'prices', 'inventory',
    'promotions', 'promotion_products', 'banners', 'site_settings'
  ];

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`[FAIL] ${table}: ${error.message}`);
    } else {
      console.log(`[OK] ${table}: ${count} records`);
    }
  }

  console.log("\n--- 6. TESTE DE LEITURA ANÔNIMA ---");
  const { data: variants, error: errVar } = await supabase.from('tire_variants').select('id, is_active').limit(5);
  console.log(`Read active variants: ${errVar ? errVar.message : (variants.length + ' rows')}`);

  console.log("\n--- 7. TESTE DE PRODUTO INATIVO ---");
  const inactive = variants?.find(v => !v.is_active);
  console.log(`Has inactive product? ${inactive ? 'Yes' : 'No'}`);

  console.log("\n--- 8. RLS — ANON WRITE ---");
  const { error: errWrite } = await supabase.from('tire_brands').insert({
    id: 'RLS_TEST_DO_NOT_USE',
    name: 'TEST',
    slug: 'test'
  });
  console.log(`Anon Insert Tire Brands: ${errWrite ? errWrite.message : 'SUCCESS (WARNING!)'}`);

  const { error: errUpdate } = await supabase.from('tire_brands').update({ name: 'Hacked' }).eq('slug', 'michelin');
  console.log(`Anon Update Tire Brands: ${errUpdate ? errUpdate.message : 'SUCCESS (WARNING!)'}`);

  const { error: errDelete } = await supabase.from('tire_brands').delete().eq('slug', 'michelin');
  console.log(`Anon Delete Tire Brands: ${errDelete ? errDelete.message : 'SUCCESS (WARNING!)'}`);

  console.log("\n--- 21/22. RLS PROFILES PRIVILEGE ESCALATION ---");
  const { error: errProfile } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', 'some-id');
  console.log(`Anon Update Profile: ${errProfile ? errProfile.message : 'SUCCESS (WARNING!)'}`);

  process.exit(0);
}

run();
