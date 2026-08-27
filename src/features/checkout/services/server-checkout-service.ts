import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { mockShippingService } from './mock-shipping-service';
import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';
import { AsaasService } from './asaas-service';

export interface CheckoutPayloadItem {
  productId: string;
  quantity: number;
  expectedPriceCents: number;
}

export interface ServerCheckoutInput {
  formData: CheckoutFormData;
  items: CheckoutPayloadItem[];
  idempotencyKey: string;
}

export type ServerCheckoutResult =
  | { 
      success: true; 
      publicId: string; 
      orderId: string;
      paymentType: 'pix' | 'credit_card';
      pixQrCode?: { encodedImage: string; payload: string; expirationDate: string };
    }
  | { success: false; errorCode: string; message: string; details?: unknown };

export class ServerCheckoutService {
  static async processCheckout(input: ServerCheckoutInput): Promise<ServerCheckoutResult> {
    try {
      // 1. Validate Form Data
      const parsed = checkoutSchema.safeParse(input.formData);
      if (!parsed.success) {
        return {
          success: false,
          errorCode: 'VALIDATION_ERROR',
          message: 'Dados de checkout inválidos.',
          details: parsed.error.format()
        };
      }

      const { customer, address, shippingOptionId, paymentMethod, creditCard } = parsed.data;

      if (!input.items || input.items.length === 0) {
        return {
          success: false,
          errorCode: 'EMPTY_CART',
          message: 'Seu carrinho está vazio.'
        };
      }

      // 2. Shipping Revalidation
      const totalQuantity = input.items.reduce((acc, item) => acc + item.quantity, 0);
      const shippingOptions = await mockShippingService.getOptions(address.zipCode, totalQuantity);
      const selectedShipping = shippingOptions.find(o => o.id === shippingOptionId);

      if (!selectedShipping) {
        return {
          success: false,
          errorCode: 'INVALID_SHIPPING',
          message: 'A opção de frete selecionada é inválida ou não está mais disponível.'
        };
      }

      // 3. Assemble RPC Payload
      const rpcPayload = {
        idempotencyKey: input.idempotencyKey,
        customer: {
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          cpf: customer.cpf
        },
        address: {
          recipientName: customer.fullName,
          postalCode: address.zipCode,
          street: address.street,
          number: address.number,
          complement: address.complement || '',
          district: address.neighborhood,
          city: address.city,
          state: address.state
        },
        items: input.items,
        shippingMethodId: selectedShipping.id,
        shippingMethodName: selectedShipping.name,
        shippingMinDays: selectedShipping.estimatedMinDays,
        shippingMaxDays: selectedShipping.estimatedMaxDays,
        shippingCents: Math.round(selectedShipping.price * 100),
        paymentMethod: paymentMethod
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as unknown as any; // Bypass strict supabase-js Json typing for arrays/objects in RPC

      // 4. Call Transactional RPC using Privileged Server-Only Client
      const adminClient = getSupabaseAdmin();
      const { data, error } = await adminClient.rpc('create_pending_order', {
        payload: rpcPayload
      });

      if (error) {
        // Handle mapped Postgres Exceptions
        const msg = error.message;
        if (msg.includes('INVALID_QUANTITY')) return { success: false, errorCode: 'INVALID_QUANTITY', message: 'Quantidade inválida para um ou mais produtos.' };
        if (msg.includes('INVALID_PRODUCT')) return { success: false, errorCode: 'INVALID_PRODUCT', message: 'Um ou mais produtos não estão mais disponíveis.' };
        if (msg.includes('OUT_OF_STOCK')) return { success: false, errorCode: 'OUT_OF_STOCK', message: 'Estoque insuficiente para um ou mais produtos. Revise seu carrinho.' };
        if (msg.includes('PRICE_CHANGED')) return { success: false, errorCode: 'PRICE_CHANGED', message: 'O preço de um ou mais produtos foi alterado. Revise seu carrinho.' };
        if (msg.includes('INTERNAL_ERROR')) return { success: false, errorCode: 'INTERNAL_ERROR', message: 'Erro interno ao processar pedido. Tente novamente.' };

        console.error('[Checkout Error]', error);
        return {
          success: false,
          errorCode: 'UNKNOWN_ERROR',
          message: 'Erro desconhecido ao processar seu pedido.'
        };
      }

      // 5. Success Result from DB
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultData = data as any;
      if (!resultData) throw new Error('No data returned from RPC');
      
      // 6. Asaas Integration
      let asaasCustomerId: string;
      try {
        asaasCustomerId = await AsaasService.createCustomer({
          name: customer.fullName,
          email: customer.email,
          cpfCnpj: customer.cpf,
          phone: customer.phone,
        });
      } catch (err) {
        console.error('[Asaas Error] Failed to create customer', err);
        return {
          success: false,
          errorCode: 'PAYMENT_GATEWAY_ERROR',
          message: 'Erro ao conectar com o provedor de pagamentos.'
        };
      }

      if (paymentMethod === 'pix') {
        try {
          const chargeId = await AsaasService.createPixCharge({
            customerId: asaasCustomerId,
            value: resultData.total_cents / 100, // Convert cents to decimal
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 1 day
            externalReference: resultData.id
          });
          const qrCode = await AsaasService.getPixQrCode(chargeId);
          
          await adminClient.from('orders').update({
            payment_method: 'pix',
            external_customer_id: asaasCustomerId,
            external_payment_id: chargeId,
            payment_url: qrCode.payload
          }).eq('id', resultData.id);

          return {
            success: true,
            publicId: resultData.public_id,
            orderId: resultData.id,
            paymentType: 'pix',
            pixQrCode: qrCode
          };
        } catch (err) {
          console.error('[Asaas Error] Failed to create PIX', err);
          return { success: false, errorCode: 'PAYMENT_GATEWAY_ERROR', message: 'Erro ao gerar PIX.' };
        }
      } else if (paymentMethod === 'credit_card' && creditCard) {
        try {
          const charge = await AsaasService.createCreditCardCharge({
            customerId: asaasCustomerId,
            value: resultData.total_cents / 100,
            dueDate: new Date().toISOString().split('T')[0],
            externalReference: resultData.id,
            creditCard: {
              holderName: creditCard.holderName!,
              number: creditCard.number!.replace(/\D/g, ''),
              expiryMonth: creditCard.expiryMonth!,
              expiryYear: creditCard.expiryYear!,
              ccv: creditCard.ccv!
            },
            creditCardHolderInfo: {
              name: customer.fullName,
              email: customer.email,
              cpfCnpj: customer.cpf,
              postalCode: address.zipCode.replace(/\D/g, ''),
              addressNumber: address.number,
              addressComplement: address.complement || null,
              phone: customer.phone.replace(/\D/g, '')
            }
          });

          const isPaid = charge.status === 'CONFIRMED' || charge.status === 'RECEIVED';

          await adminClient.from('orders').update({
            payment_method: 'credit_card',
            external_customer_id: asaasCustomerId,
            external_payment_id: charge.id,
            payment_status: isPaid ? 'paid' : 'pending'
          }).eq('id', resultData.id);

          return {
            success: true,
            publicId: resultData.public_id,
            orderId: resultData.id,
            paymentType: 'credit_card'
          };
        } catch (err) {
          console.error('[Asaas Error] Failed to process Credit Card', err);
          return { success: false, errorCode: 'PAYMENT_DECLINED', message: 'Pagamento recusado. Verifique os dados do cartão.' };
        }
      }

      // Fallback
      return {
        success: true,
        publicId: resultData.public_id,
        orderId: resultData.id,
        paymentType: 'pix' // default
      };

    } catch (err: unknown) {
      console.error('[Checkout Exception]', err);
      return {
        success: false,
        errorCode: 'SERVER_EXCEPTION',
        message: 'Ocorreu um erro inesperado no servidor: ' + (err instanceof Error ? err.message : String(err))
      };
    }
  }
}
