import { open, run, screenshot, wait } from '../utils.mjs';

async function runTest() {
  console.log("=== Smoke Test: Storefront ===");
  try {
    console.log("Abrindo Home...");
    open('/');
    wait(2000);
    screenshot('home-desktop');
    
    console.log("Abrindo Catálogo...");
    open('/pneus');
    wait(2000);
    screenshot('catalog-desktop');
    
    console.log("Abrindo Primeiro Produto (PDP)...");
    open('/produto/touring-contact-195-55-r16');
    wait(2000);
    screenshot('pdp-desktop');

    console.log("Adicionando ao Carrinho...");
    run(`find role button click --name "ADICIONAR AO CARRINHO"`);
    wait(1000);
    
    console.log("Verificando Carrinho...");
    open('/carrinho');
    wait(2000);
    screenshot('cart-desktop');
    
    console.log("Indo para Checkout...");
    run(`find role link click --name "IR PARA O CHECKOUT"`);
    wait(2000);
    screenshot('checkout-desktop');
    
    console.log("✅ Storefront Smoke Test Passed");
  } catch(e) {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  }
}

runTest();
