import { z } from 'zod';

export const BannerSchema = z.object({
  id: z.string().uuid().optional(),
  internal_name: z.string().min(1, 'Nome interno é obrigatório.'),
  headline: z.string().optional(),
  highlight_text: z.string().optional(),
  subheadline: z.string().optional(),
  desktop_image_url: z.string().min(1, 'A imagem desktop é obrigatória.'),
  mobile_image_url: z.string().optional(),
  image_alt: z.string().optional(),
  primary_cta_label: z.string().optional(),
  primary_cta_url: z.string().optional(),
  secondary_cta_label: z.string().optional(),
  secondary_cta_url: z.string().optional(),
  theme: z.enum(['dark', 'light', 'auto']).default('dark'),
  text_alignment: z.enum(['left', 'center']).default('left'),
  overlay_strength: z.enum(['none', 'light', 'medium', 'strong']).default('medium'),
  position: z.enum(['home_hero', 'home_promo_1', 'home_promo_2', 'catalog_banner']),
  priority: z.coerce.number().int().default(0),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.primary_cta_url && !data.primary_cta_url.startsWith('/') && !data.primary_cta_url.startsWith('http')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A URL do CTA deve ser um caminho interno (ex: /pneus) ou URL externa completa.',
      path: ['primary_cta_url'],
    });
  }
  if (data.secondary_cta_url && !data.secondary_cta_url.startsWith('/') && !data.secondary_cta_url.startsWith('http')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A URL do CTA secundário deve ser um caminho interno ou URL externa completa.',
      path: ['secondary_cta_url'],
    });
  }
  if (data.starts_at && data.ends_at && new Date(data.ends_at) < new Date(data.starts_at)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A data de término deve ser posterior à data de início.',
      path: ['ends_at'],
    });
  }
});

export type BannerFormData = z.infer<typeof BannerSchema>;
