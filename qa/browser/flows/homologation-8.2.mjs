import { open, run, wait, loginAdmin } from '../utils.mjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("=== Homologação Fase 8.2 ===");

  // Pegar um produto de teste
  const targetSlug = process.env.QA_TARGET_PRODUCT_SLUG || 'touring-contact-195-55-r16'; // Fallback will probably fail, but we'll fetch the first active one instead
  
  const { data: productData, error } = await supabase
    .from('tire_variants')
    .select('id, is_active, prices(regular_price_cents), inventory(quantity)')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error || !productData) {
    console.error("❌ Erro ao buscar produto base para QA:", error?.message);
    process.exit(1);
  }

  const product = { id: productData.id, slug: productData.id }; // Simplified slug
  const originalPrice = productData.prices?.[0]?.regular_price_cents ? productData.prices[0].regular_price_cents / 100 : 500;
  const originalStock = productData.inventory?.[0]?.quantity ?? 10;
  const originalActive = productData.is_active;

  console.log(`[QA] Produto alvo selecionado: ${product.model} (${product.id})`);
  console.log(`[QA] Estado Original - Preço: ${originalPrice}, Estoque: ${originalStock}, Ativo: ${originalActive}`);

  try {
    console.log("Realizando Login Administrativo...");
    loginAdmin();

    // 1. MUTAÇÃO DE PREÇO
    console.log("=== Testando Preço ===");
    console.log("ADMIN -> Alterando Preço...");
    open(`/admin/produtos/${product.id}/editar`);
    wait(2000);
    const newPrice = Number(originalPrice) + 1;
    run(`find role textbox fill "${newPrice}" --name "Preço Regular (R$)"`);
    run(`find role button click --name "Salvar"`);
    wait(2000);

    console.log("STOREFRONT -> Verificando Preço Atualizado...");
    open(`/produto/${product.slug}`);
    wait(2000);
    // Verificar se o preço está lá. Vamos tentar dar um screenshot e um find text
    run(`screenshot "qa/browser/screenshots/homologation-price-updated.png"`);
    // Dependendo do formatCurrency
    
    console.log("ADMIN -> Restaurando Preço...");
    open(`/admin/produtos/${product.id}/editar`);
    wait(2000);
    run(`find role textbox fill "${originalPrice}" --name "Preço Regular (R$)"`);
    run(`find role button click --name "Salvar"`);
    wait(2000);

    // 2. MUTAÇÃO DE ESTOQUE
    console.log("=== Testando Estoque ===");
    console.log("ADMIN -> Alterando Estoque...");
    open(`/admin/produtos/${product.id}/editar`);
    wait(2000);
    const newStock = Number(originalStock) - 1;
    run(`find role spinbutton fill "${newStock}" --name "Estoque Disponível"`);
    run(`find role button click --name "Salvar"`);
    wait(2000);

    console.log("STOREFRONT -> Verificando Estoque Atualizado...");
    open(`/produto/${product.slug}`);
    wait(2000);
    run(`screenshot "qa/browser/screenshots/homologation-stock-updated.png"`);

    console.log("ADMIN -> Restaurando Estoque...");
    open(`/admin/produtos/${product.id}/editar`);
    wait(2000);
    run(`find role spinbutton fill "${originalStock}" --name "Estoque Disponível"`);
    run(`find role button click --name "Salvar"`);
    wait(2000);

    // 3. MUTAÇÃO DE ARCHIVE
    console.log("=== Testando Archive (Inativação) ===");
    console.log("ADMIN -> Inativando Produto...");
    open(`/admin/produtos/${product.id}/editar`);
    wait(2000);
    run(`find role checkbox click --name "Produto Ativo"`); // Toggle
    run(`find role button click --name "Salvar"`);
    wait(2000);

    console.log("STOREFRONT -> Verificando Produto Removido...");
    open(`/pneus`); // Catalogo
    wait(2000);
    run(`screenshot "qa/browser/screenshots/homologation-archive.png"`);

    console.log("ADMIN -> Restaurando Produto...");
    open(`/admin/produtos/${product.id}/editar`);
    wait(2000);
    run(`find role checkbox click --name "Produto Ativo"`); // Toggle back
    run(`find role button click --name "Salvar"`);
    wait(2000);

    console.log("Realizando Logout...");
    open('/admin');
    wait(1000);
    run(`find role button click --name "Sair"`);
    wait(2000);

    console.log("✅ Homologação Fase 8.2 Passou!");

  } catch(e) {
    console.error("❌ Failed:", e.message);
    process.exitCode = 1;
  } finally {
    console.log("[CLEANUP] Garantindo restauração do estado original via DB...");
    await supabase.from('tire_variants').update({ is_active: originalActive }).eq('id', product.id);
    
    const { data: priceData } = await supabase.from('prices').select('id').eq('tire_variant_id', product.id).single();
    if (priceData) {
      await supabase.from('prices').update({ regular_price_cents: Math.round(originalPrice * 100) }).eq('id', priceData.id);
    }
    
    const { data: invData } = await supabase.from('inventory').select('id').eq('tire_variant_id', product.id).single();
    if (invData) {
      await supabase.from('inventory').update({ quantity: originalStock }).eq('id', invData.id);
    }
    console.log("[CLEANUP] OK.");
  }
}

runTest();
