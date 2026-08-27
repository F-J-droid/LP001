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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const payload = {
    idempotencyKey: 'test-' + Date.now(),
    customer: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '11999999999',
      cpf: '12345678909'
    },
    address: {
      zipCode: '12345-678',
      street: 'Rua Teste',
      number: '123',
      complement: '',
      district: 'Bairro Teste',
      city: 'Cidade Teste',
      state: 'SP',
      recipientName: 'Test User'
    },
    items: [
      {
        productId: '4a6006e8-285b-43d9-a78b-d72b53b8110b', // Let's get a real product ID
        quantity: 1,
        expectedPriceCents: 34191
      }
    ],
    shippingMethod: {
      id: 'sedex',
      name: 'Sedex',
      price: 15.00,
      estimatedMinDays: 3,
      estimatedMaxDays: 5
    }
  };

  // Get a real variant ID to test
  const { data: variants } = await supabase.from('tire_variants').select('id, sku').limit(1);
  if (variants && variants.length > 0) {
    payload.items[0].productId = variants[0].id;
    console.log('Using variant:', variants[0].id);
    
    // Get the price to pass correctly
    const { data: price } = await supabase.from('prices').select('pix_price_cents, sale_price_cents, regular_price_cents').eq('tire_variant_id', variants[0].id).single();
    if (price) {
       payload.items[0].expectedPriceCents = price.pix_price_cents || price.sale_price_cents || price.regular_price_cents;
       console.log('Using price:', payload.items[0].expectedPriceCents);
    }
  }

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
