const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envLines = envLocal.split('\n');
for (const line of envLines) {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    process.env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: variants } = await supabase.from('tire_variants').select('id, sku').limit(1);
  const variantId = variants[0].id;
  const { data: price } = await supabase.from('prices').select('pix_price_cents, sale_price_cents, regular_price_cents').eq('tire_variant_id', variantId).single();
  
  const expectedPriceCents = price.sale_price_cents || price.regular_price_cents;

  const payload = {
    idempotencyKey: 'test-' + Date.now(),
    customer: {
      name: 'F J',
      email: '0536767880a@gmail.com',
      phone: '(22) 99215-7330',
      cpf: '114.524.287-19'
    },
    address: {
      recipientName: 'F J',
      postalCode: '12345678',
      street: 'Rua Teste',
      number: '123',
      complement: '',
      district: 'Bairro Teste',
      city: 'Cidade Teste',
      state: 'SP'
    },
    items: [
      {
        productId: variantId,
        quantity: 1,
        expectedPriceCents: expectedPriceCents
      }
    ],
    shippingMethodId: 'eco',
    shippingMethodName: 'Entrega Econômica',
    shippingMinDays: 3,
    shippingMaxDays: 5,
    shippingCents: 1500,
    paymentMethod: 'credit_card'
  };

  console.log('Sending payload:', payload);

  const { data, error } = await supabase.rpc('create_pending_order', {
    payload: payload
  });

  if (error) {
    console.error('RPC Error:', error);
  } else {
    console.log('RPC Success:', data);
  }
}

test();
