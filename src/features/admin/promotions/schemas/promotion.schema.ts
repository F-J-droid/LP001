import { z } from 'zod';

export const PromotionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório.'),
  slug: z.string().min(1, 'Slug é obrigatório.'),
  type: z.enum(['percentage', 'fixed_amount', 'fixed_price']),
  value: z.coerce.number().min(0.01, 'O valor deve ser maior que 0.'),
  starts_at: z.string().min(1, 'Data de início é obrigatória.'),
  ends_at: z.string().min(1, 'Data de término é obrigatória.'),
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.type === 'percentage' && data.value > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O valor percentual não pode ser maior que 100%.',
      path: ['value'],
    });
  }
  if (new Date(data.ends_at) < new Date(data.starts_at)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A data de término deve ser posterior à data de início.',
      path: ['ends_at'],
    });
  }
});

export type PromotionFormData = z.infer<typeof PromotionSchema>;
