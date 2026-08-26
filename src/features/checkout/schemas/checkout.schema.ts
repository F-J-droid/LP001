import * as z from 'zod';
import { isValidCpf } from '../utils/cpf';
import { isValidPhone, isValidZipCode } from '../utils/masks';

export const customerSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().refine(isValidCpf, { message: 'CPF inválido' }),
  phone: z.string().refine(isValidPhone, { message: 'Telefone inválido' })
});

export const addressSchema = z.object({
  zipCode: z.string().refine(isValidZipCode, { message: 'CEP inválido' }),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Selecione um estado válido')
});

export const creditCardSchema = z.object({
  holderName: z.string().optional(),
  number: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  ccv: z.string().optional(),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  address: addressSchema,
  shippingOptionId: z.string().min(1, 'Selecione uma opção de entrega'),
  paymentMethod: z.enum(['pix', 'credit_card'], {
    message: 'Selecione uma forma de pagamento'
  }),
  creditCard: creditCardSchema.optional(),
  acceptTerms: z.literal(true, {
    message: 'Você precisa aceitar os termos de uso'
  })
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'credit_card') {
    const cc = data.creditCard;
    if (!cc?.holderName || cc.holderName.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nome no cartão inválido', path: ['creditCard', 'holderName'] });
    }
    if (!cc?.number || cc.number.replace(/\D/g, '').length < 13) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Número de cartão inválido', path: ['creditCard', 'number'] });
    }
    if (!cc?.expiryMonth || cc.expiryMonth.length !== 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mês inválido (MM)', path: ['creditCard', 'expiryMonth'] });
    }
    if (!cc?.expiryYear || cc.expiryYear.length !== 4) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ano inválido (YYYY)', path: ['creditCard', 'expiryYear'] });
    }
    if (!cc?.ccv || cc.ccv.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CVV inválido', path: ['creditCard', 'ccv'] });
    }
  }
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
