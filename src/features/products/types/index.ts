export type TireBadge = 'Oferta' | 'Mais vendido' | 'Lançamento' | 'Frete grátis' | 'Melhor avaliado';

export interface TireBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface TireCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface TireProduct {
  id: string;
  slug: string;
  sku: string;
  brand: string;
  model: string;
  width: number;
  profile: number;
  rim: number;
  loadIndex: string;
  speedIndex: string;
  vehicleType: 'Passeio' | 'SUV' | 'Pickup' | 'Utilitário' | '4x4' | 'Performance';
  runFlat: boolean;
  reinforced: boolean;
  price: number;
  promotionalPrice?: number;
  pixPrice?: number;
  installmentCount?: number;
  installmentValue?: number;
  stockStatus: 'available' | 'out_of_stock' | 'pre_order';
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  gallery?: string[];
  badges?: TireBadge[];
  freeShipping?: boolean;
  description?: string;
  isActive?: boolean;
  warrantyMonths?: number;
  ean?: string;
  inmetroCode?: string;
  efficiency?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  wetGrip?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  externalNoiseDb?: number;
  stockQuantity?: number;
}