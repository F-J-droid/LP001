import { z } from 'zod';

export const StoreInfoSettingsSchema = z.object({
  store_name: z.string().min(1, 'Nome da loja é obrigatório.'),
  legal_name: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.string().min(1, 'Logo URL é obrigatória.'),
  favicon_url: z.string().optional(),
});

export const BrandingSettingsSchema = z.object({
  brandName: z.string().min(1, 'Nome da marca é obrigatório.'),
  logoDefaultUrl: z.string().optional(),
  logoLightUrl: z.string().optional(),
  logoDarkUrl: z.string().optional(),
  logoMobileUrl: z.string().optional(),
  logoAlt: z.string().optional(),
  logoWidthDesktop: z.coerce.number().min(80).max(280).default(150),
  logoWidthMobile: z.coerce.number().min(60).max(200).default(120),
  showBrandName: z.boolean().default(false),
});

export const ContactSettingsSchema = z.object({
  email: z.string().email('Email inválido.'),
  phone: z.string().min(8, 'Telefone inválido.'),
  whatsapp: z.string().min(8, 'WhatsApp inválido.'),
  business_hours: z.string().optional(),
});

export const SocialMediaSettingsSchema = z.object({
  instagram: z.string().url('URL inválida.').optional().or(z.literal('')),
  facebook: z.string().url('URL inválida.').optional().or(z.literal('')),
  youtube: z.string().url('URL inválida.').optional().or(z.literal('')),
  tiktok: z.string().url('URL inválida.').optional().or(z.literal('')),
});

export const CommerceSettingsSchema = z.object({
  max_installments: z.coerce.number().int().min(1).max(24),
  pix_label: z.string().min(1),
  low_stock_threshold: z.coerce.number().int().min(0),
  currency: z.literal('BRL'),
});

export const SeoSettingsSchema = z.object({
  default_title: z.string().min(1, 'Título padrão é obrigatório.'),
  default_description: z.string().min(1, 'Descrição padrão é obrigatória.'),
  og_image_url: z.string().optional(),
});

export type StoreInfoSettings = z.infer<typeof StoreInfoSettingsSchema>;
export type BrandingSettings = z.infer<typeof BrandingSettingsSchema>;
export type ContactSettings = z.infer<typeof ContactSettingsSchema>;
export type SocialMediaSettings = z.infer<typeof SocialMediaSettingsSchema>;
export type CommerceSettings = z.infer<typeof CommerceSettingsSchema>;
export type SeoSettings = z.infer<typeof SeoSettingsSchema>;

// --- TRACKING SCHEMAS ---

export const MetaTrackingSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  pixelId: z.string().optional(),
  capiEnabled: z.boolean().default(false),
  advancedMatchingEnabled: z.boolean().default(false),
  testEventCode: z.string().optional(),
});

export const Ga4TrackingSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  measurementId: z.string().regex(/^G-[A-Z0-9]+$/, 'Formato inválido. Ex: G-XXXXXXXXXX').optional().or(z.literal('')),
});

export const GtmTrackingSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  containerId: z.string().regex(/^GTM-[A-Z0-9]+$/, 'Formato inválido. Ex: GTM-XXXXXXX').optional().or(z.literal('')),
});

export const GoogleAdsTrackingSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  conversionId: z.string().regex(/^AW-[0-9]+$/, 'Formato inválido. Ex: AW-XXXXXXXXX').optional().or(z.literal('')),
  purchaseConversionLabel: z.string().optional(),
  enhancedConversionsEnabled: z.boolean().default(false),
});

export const TrackingSettingsSchema = z.object({
  meta: MetaTrackingSettingsSchema.default({ enabled: false, capiEnabled: false, advancedMatchingEnabled: false }),
  ga4: Ga4TrackingSettingsSchema.default({ enabled: false }),
  gtm: GtmTrackingSettingsSchema.default({ enabled: false }),
  googleAds: GoogleAdsTrackingSettingsSchema.default({ enabled: false, enhancedConversionsEnabled: false }),
});

export type MetaTrackingSettings = z.infer<typeof MetaTrackingSettingsSchema>;
export type Ga4TrackingSettings = z.infer<typeof Ga4TrackingSettingsSchema>;
export type GtmTrackingSettings = z.infer<typeof GtmTrackingSettingsSchema>;
export type GoogleAdsTrackingSettings = z.infer<typeof GoogleAdsTrackingSettingsSchema>;
export type TrackingSettings = z.infer<typeof TrackingSettingsSchema>;
