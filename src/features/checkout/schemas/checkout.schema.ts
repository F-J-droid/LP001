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

export const checkoutSchema = z.object({
  customer: customerSchema,
  address: addressSchema,
  shippingOptionId: z.string().min(1, 'Selecione uma opção de entrega'),
  paymentMethod: z.enum(['pix', 'credit_card'], {
    message: 'Selecione uma forma de pagamento'
  }),
  acceptTerms: z.literal(true, {
    message: 'Você precisa aceitar os termos de uso'
  })
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
