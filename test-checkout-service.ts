import { ServerCheckoutService } from './src/features/checkout/services/server-checkout-service';

async function test() {
  const payload = {
    idempotencyKey: 'test-' + Date.now(),
    formData: { customer: { fullName: 'F J', email: '0536767880a@gmail.com', phone: '(22) 99215-7330', cpf: '114.524.287-19' }, address: { zipCode: '12345-678', street: 'Rua Teste', number: '123', complement: '', neighborhood: 'Bairro Teste', city: 'Cidade Teste', state: 'SP' }, shippingOptionId: 'eco',
      paymentMethod: 'credit_card',
      acceptTerms: true,
      creditCard: {
        holderName: 'F J Silva',
        number: '1111222233334444',
        expiryMonth: '12',
        expiryYear: '2028',
        ccv: '123'
      }
    },
    items: [
      {
        productId: '3bfa0517-a8d0-41ae-8197-ac1243861c57',
        quantity: 1,
        expectedPriceCents: 68990
      }
    ]
  };

  try {
    const result = await ServerCheckoutService.processCheckout(payload as any);
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
