import { TireProduct, TireBrand, TireCategory } from '@/features/products/types';
import { VehicleBrand, VehicleModel, VehicleVersion, VehicleFitment, TireSize } from '@/features/vehicles/types';

export interface InventoryItem {
  productId: string;
  sku: string;
  available: number;
  reserved: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'price';
  value: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  headline: string;
  subheadline?: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  position: string; // e.g., 'home_hero', 'home_promo1'
  priority: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface MockOrder {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    cpf: string;
  };
  items: {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'pix' | 'credit_card';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface SiteSettings {
  general: {
    storeName: string;
    description: string;
    logoUrl?: string;
  };
  contact: {
    whatsapp: string;
    email: string;
    hours: string;
  };
  commercial: {
    maxInstallments: number;
    pixDiscountText: string;
    currency: string;
  };
  inventory: {
    lowStockThreshold: number;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
  };
}

export interface AdminDatabase {
  version: number;
  products: TireProduct[];
  brands: TireBrand[];
  categories: TireCategory[];
  sizes: TireSize[];
  inventory: InventoryItem[];
  promotions: Promotion[];
  banners: Banner[];
  orders: MockOrder[];
  settings: SiteSettings;

  // V2 Vehicles
  vehicleBrands?: VehicleBrand[];
  vehicleModels?: VehicleModel[];
  vehicleVersions?: VehicleVersion[];
  vehicleFitments?: VehicleFitment[];
}
