import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { mockShippingService } from './mock-shipping-service';
import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';

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
  | { success: true; publicId: string; orderId: string }
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

      const { customer, address, shippingOptionId, paymentMethod } = parsed.data;

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
      const { data, error } = await supabaseAdmin.rpc('create_pending_order', {
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

      // 5. Success Result
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultData = data as any;
      if (!resultData) throw new Error('No data returned from RPC');
      
      return {
        success: true,
        publicId: resultData.public_id,
        orderId: resultData.id
      };
    } catch (err: unknown) {
      console.error('[Checkout Exception]', err);
      return {
        success: false,
        errorCode: 'SERVER_EXCEPTION',
        message: 'Ocorreu um erro inesperado no servidor.'
      };
    }
  }
}
