import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tables = [
    'profiles',
    'tire_brands',
    'tire_models',
    'tire_sizes',
    'tire_variants',
    'categories',
    'product_categories',
    'product_images',
    'prices',
    'inventory',
    'promotions',
    'promotion_products',
    'banners',
    'site_settings'
  ];

  console.log("--- TABELAS EXISTENTES ---");
  for (const table of tables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`[FAIL] ${table}: Erro -> ${error.message}`);
    } else {
      console.log(`[OK] ${table}: ${count} registros`);
    }
  }
}
run();
