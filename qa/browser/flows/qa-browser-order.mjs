import { open, run, screenshot, wait } from '../utils.mjs';

async function runBrowserOrderQA() {
  console.log('=== INICIANDO FLUXO DE COMPRA E2E ===');
  
  try {
    console.log('1. Acessando a Home...');
    open('/');
    wait(2000);
    screenshot('order-qa-1-home');

    console.log('2. Acessando Produto Tour Contact...');
    open('/produto/touring-contact-195-55-r16');
    wait(2000);
    screenshot('order-qa-2-pdp');

    console.log('3. Adicionando ao Carrinho...');
    run(`find role button click --name "ADICIONAR AO CARRINHO"`);
    wait(2000);
    screenshot('order-qa-3-cart');

    console.log('4. Indo para o Checkout...');
    run(`find role link click --name "IR PARA O CHECKOUT"`);
    wait(2000);
    screenshot('order-qa-4-checkout');

    console.log('5. Preenchendo o Checkout...');
    // Create random email to identify this E2E run
    const testEmail = `qa+${Date.now()}@example.test`;
    
    // Fill identity
    run(`find role textbox fill "João E2E Test" --name "Nome completo"`);
    run(`find role textbox fill "${testEmail}" --name "E-mail"`);
    run(`find role textbox fill "00000000000" --name "CPF"`); // We use a dummy maskable format
    run(`find role textbox fill "11999999999" --name "WhatsApp / Telefone"`);
    
    // Fill address
    run(`find role textbox fill "01001000" --name "CEP"`);
    wait(1500); // Wait for mock shipping to resolve
    
    run(`find role textbox fill "Praça da Sé" --name "Rua / Avenida"`);
    run(`find role textbox fill "1" --name "Número"`);
    run(`find role textbox fill "Sé" --name "Bairro"`);
    run(`find role textbox fill "São Paulo" --name "Cidade"`);
    
    run(`find role combobox click --name "UF"`);
    wait(500);
    // Since combobox can be tricky, we can just let it be if it auto-fills, or we fill it
    run(`find role combobox fill "SP" --name "UF"`);

    screenshot('order-qa-5-checkout-filled');

    console.log('6. Confirmando Termos e Finalizando...');
    run(`find role checkbox click`);
    wait(500);
    run(`find role button click --name "FINALIZAR PEDIDO"`);
    
    // Wait for server action to complete
    wait(4000);
    screenshot('order-qa-6-success');

    console.log('=== FIM DO FLUXO ===');

  } catch (err) {
    console.error('Erro no fluxo E2E:', err);
  }
}

runBrowserOrderQA();
