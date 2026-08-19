import { z } from 'zod';

export const MeasureSchema = z.object({
  id: z.string().uuid().optional(),
  width: z.coerce.number().int().min(1, 'A largura deve ser maior que 0.'),
  profile: z.coerce.number().int().min(1, 'O perfil deve ser maior que 0.'),
  rim: z.coerce.number().int().min(1, 'O aro deve ser maior que 0.')
});

export type MeasureFormData = z.infer<typeof MeasureSchema>;
