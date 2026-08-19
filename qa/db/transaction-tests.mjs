import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('--- INICIANDO TESTES TRANSACIONAIS DE ORDERS ---');

  // 1. Setup: Pegar 2 produtos ativos para teste
  const { data: variants } = await supabase
    .from('tire_variants')
    .select(`
      id,
      prices ( regular_price_cents, sale_price_cents, pix_price_cents ),
      inventory ( quantity, reserved_quantity )
    `)
    .eq('is_active', true)
    .limit(2);

  if (!variants || variants.length < 2) {
    console.error('Necessário pelo menos 2 variantes de produto no DB.');
    process.exit(1);
  }

  const v1 = variants[0];
  const v2 = variants[1];
  
  // Garantir estoque exato de 4 para o V1
  await supabase.from('inventory').update({ quantity: 4, reserved_quantity: 0 }).eq('tire_variant_id', v1.id);
  // Garantir estoque exato de 4 para o V2
  await supabase.from('inventory').update({ quantity: 4, reserved_quantity: 0 }).eq('tire_variant_id', v2.id);

  console.log(`[Setup] Inventário de V1 (${v1.id}) ajustado para 4.`);
  console.log(`[Setup] Inventário de V2 (${v2.id}) ajustado para 4.`);

  const price1 = v1.prices[0].pix_price_cents || v1.prices[0].sale_price_cents || v1.prices[0].regular_price_cents;
  const price2 = v2.prices[0].pix_price_cents || v2.prices[0].sale_price_cents || v2.prices[0].regular_price_cents;

  const makePayload = (items, key) => ({
    idempotencyKey: key,
    customer: { name: 'Test', email: 'test@test.com', phone: '11999999999', cpf: '00000000000' },
    address: { recipientName: 'Test', postalCode: '00000000', street: 'Rua', number: '1', district: 'Bairro', city: 'Cidade', state: 'SP' },
    items,
    shippingMethodId: 'eco',
    shippingMethodName: 'Eco',
    shippingMinDays: 1,
    shippingMaxDays: 2,
    shippingCents: 1000,
    paymentMethod: 'pix'
  });

  // TESTE 1: CONCORRÊNCIA (Overselling Prevention)
  console.log('\n--- TESTE 1: CONCORRÊNCIA ---');
  console.log('Tentando comprar 3 unidades concorrentemente (total de 6) com apenas 4 disponíveis.');
  const p1 = supabase.rpc('create_pending_order', { payload: makePayload([{ productId: v1.id, quantity: 3, expectedPriceCents: price1 }], crypto.randomUUID()) });
  const p2 = supabase.rpc('create_pending_order', { payload: makePayload([{ productId: v1.id, quantity: 3, expectedPriceCents: price1 }], crypto.randomUUID()) });

  const [res1, res2] = await Promise.all([p1, p2]);
  
  const successCount = [res1, res2].filter(r => !r.error).length;
  const errorCount = [res1, res2].filter(r => r.error && r.error.message.includes('OUT_OF_STOCK')).length;

  console.log(`Resultados: ${successCount} Sucesso(s), ${errorCount} OUT_OF_STOCK`);
  if (successCount === 1 && errorCount === 1) {
    console.log('✅ PASS: Concorrência bloqueou overselling corretamente.');
  } else {
    console.error('❌ FAIL: Comportamento de concorrência inesperado.', { res1, res2 });
  }

  // Verifica inventário
  const { data: checkInv1 } = await supabase.from('inventory').select('reserved_quantity').eq('tire_variant_id', v1.id).single();
  if (checkInv1.reserved_quantity === 3) {
    console.log(`✅ PASS: Quantidade reservada é exatamente 3 (não 6).`);
  } else {
    console.error(`❌ FAIL: Quantidade reservada está errada: ${checkInv1.reserved_quantity}`);
  }

  // TESTE 2: DEADLOCK (Inversão de Ordem de Itens)
  console.log('\n--- TESTE 2: DEADLOCK PREVENTION ---');
  // Ajustar estoque para 10 para V1 e V2
  await supabase.from('inventory').update({ quantity: 10, reserved_quantity: 0 }).eq('tire_variant_id', v1.id);
  await supabase.from('inventory').update({ quantity: 10, reserved_quantity: 0 }).eq('tire_variant_id', v2.id);

  console.log('Disparando dois pedidos com os mesmos SKUs mas em ordem invertida no payload...');
  const itemsA = [
    { productId: v1.id, quantity: 1, expectedPriceCents: price1 },
    { productId: v2.id, quantity: 1, expectedPriceCents: price2 }
  ];
  const itemsB = [
    { productId: v2.id, quantity: 1, expectedPriceCents: price2 },
    { productId: v1.id, quantity: 1, expectedPriceCents: price1 }
  ];

  const p3 = supabase.rpc('create_pending_order', { payload: makePayload(itemsA, crypto.randomUUID()) });
  const p4 = supabase.rpc('create_pending_order', { payload: makePayload(itemsB, crypto.randomUUID()) });

  const [res3, res4] = await Promise.all([p3, p4]);
  if (!res3.error && !res4.error) {
    console.log('✅ PASS: Nenhum deadlock ocorreu ao processar os itens concorrentemente.');
  } else {
    console.error('❌ FAIL: Erro no teste de deadlock.', { res3, res4 });
  }

  // TESTE 3: IDEMPOTÊNCIA
  console.log('\n--- TESTE 3: IDEMPOTÊNCIA ---');
  const idempotencyKey = crypto.randomUUID();
  console.log(`Usando a mesma key: ${idempotencyKey}`);
  
  const p5 = supabase.rpc('create_pending_order', { payload: makePayload([{ productId: v1.id, quantity: 1, expectedPriceCents: price1 }], idempotencyKey) });
  const p6 = supabase.rpc('create_pending_order', { payload: makePayload([{ productId: v1.id, quantity: 1, expectedPriceCents: price1 }], idempotencyKey) });

  const [res5, res6] = await Promise.all([p5, p6]);
  
  if (!res5.error && !res6.error && res5.data.id === res6.data.id) {
    console.log('✅ PASS: A idempotência garantiu que o mesmo order_id fosse retornado, gerando apenas 1 pedido.');
  } else {
    console.error('❌ FAIL: Erro no teste de idempotência.', { res5, res6 });
  }

  // TESTE 4: CANCELAMENTO IDEMPOTENTE
  console.log('\n--- TESTE 4: CANCELAMENTO IDEMPOTENTE ---');
  const orderId = res5.data.id;
  
  // Pegar estoque antes do cancel
  const { data: invBefore } = await supabase.from('inventory').select('reserved_quantity').eq('tire_variant_id', v1.id).single();
  
  console.log('Cancelando o pedido pela primeira vez...');
  await supabase.rpc('cancel_pending_order', { p_order_id: orderId });
  const { data: invAfter1 } = await supabase.from('inventory').select('reserved_quantity').eq('tire_variant_id', v1.id).single();
  
  if (invAfter1.reserved_quantity === invBefore.reserved_quantity - 1) {
    console.log('✅ PASS: Primeira liberação subtraiu a reserva corretamente.');
  } else {
    console.error('❌ FAIL: Reserva não liberou corretamente.', { before: invBefore, after: invAfter1 });
  }

  console.log('Cancelando o pedido pela segunda vez (Idempotente)...');
  await supabase.rpc('cancel_pending_order', { p_order_id: orderId });
  const { data: invAfter2 } = await supabase.from('inventory').select('reserved_quantity').eq('tire_variant_id', v1.id).single();

  if (invAfter2.reserved_quantity === invAfter1.reserved_quantity) {
    console.log('✅ PASS: O segundo cancelamento ignorou a operação com segurança (não descontou duplo).');
  } else {
    console.error('❌ FAIL: Ocorreu desconto duplo de estoque no segundo cancelamento!', { after1: invAfter1, after2: invAfter2 });
  }

  console.log('\n--- TESTES FINALIZADOS ---');
}

runTests().catch(console.error);
