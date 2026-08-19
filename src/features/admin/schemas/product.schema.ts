import { z } from 'zod';

export const productSchema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  sku: z.string().min(1, 'SKU é obrigatório'),
  ean: z.string().optional(),
  vehicleType: z.enum(['Passeio', 'SUV', 'Pickup', 'Utilitário', '4x4', 'Performance'], {
    message: 'Categoria é obrigatória'
  }),
  description: z.string().optional(),
  
  width: z.coerce.number().min(100, 'Largura inválida'),
  profile: z.coerce.number().min(20, 'Perfil inválido'),
  rim: z.coerce.number().min(10, 'Aro inválido'),
  loadIndex: z.string().min(1, 'Índice de carga é obrigatório'),
  speedIndex: z.string().min(1, 'Índice de velocidade é obrigatório'),
  
  runFlat: z.boolean().default(false),
  reinforced: z.boolean().default(false),
  
  price: z.coerce.number().min(1, 'Preço é obrigatório'),
  promotionalPrice: z.coerce.number().optional(),
  pixPrice: z.coerce.number().optional(),
  
  stockQuantity: z.coerce.number().min(0, 'Não pode ser negativo').default(0),
  
  imageUrl: z.string().url('URL inválida').min(1, 'Imagem é obrigatória'),
  
  isActive: z.boolean().default(true),
  
  // Badges as boolean flags for the form
  badgeOferta: z.boolean().default(false),
  badgeMaisVendido: z.boolean().default(false),
  badgeLancamento: z.boolean().default(false),
  
  inmetroCode: z.string().optional(),
  efficiency: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),
  wetGrip: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),
  externalNoiseDb: z.coerce.number().optional(),
}).refine(data => {
  if (data.promotionalPrice && data.promotionalPrice >= data.price) {
    return false;
  }
  return true;
}, {
  message: 'Preço promocional deve ser menor que o regular',
  path: ['promotionalPrice']
});

export type ProductFormData = z.infer<typeof productSchema>;
