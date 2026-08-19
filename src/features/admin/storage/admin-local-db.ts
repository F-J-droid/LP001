import fs from 'fs';
import path from 'path';
import { AdminDatabase } from '../types';
import { 
  MOCK_PRODUCTS as mockProducts, 
  MOCK_BRANDS as mockBrands, 
  MOCK_CATEGORIES as mockCategories 
} from '@/features/products/data/mock-products';
import { 
  MOCK_TIRE_SIZES, 
  MOCK_VEHICLE_BRANDS, 
  MOCK_VEHICLE_MODELS, 
  MOCK_VEHICLE_VERSIONS, 
  MOCK_VEHICLE_FITMENTS 
} from '@/features/vehicles/data/mock-vehicles';

const FILE_PATH = path.join(process.cwd(), 'tirestore_admin_catalog_v1.json');

function createInitialDb(): AdminDatabase {
  return {
    version: 2,
    products: [...mockProducts],
    brands: [...mockBrands],
    categories: [...mockCategories],
    sizes: [...MOCK_TIRE_SIZES],
    inventory: mockProducts.map(p => ({
      productId: p.id,
      sku: p.sku,
      available: 10,
      reserved: 0,
      status: 'in_stock'
    })),
    promotions: [],
    banners: [],
    orders: [],
    settings: {
      general: {
        storeName: 'TireStore',
        description: 'Os melhores pneus para o seu veículo',
      },
      contact: {
        whatsapp: '(11) 99999-9999',
        email: 'contato@tirestore.com',
        hours: 'Seg a Sex das 8h às 18h'
      },
      commercial: {
        maxInstallments: 12,
        pixDiscountText: 'Até 10% OFF',
        currency: 'BRL'
      },
      inventory: {
        lowStockThreshold: 5
      },
      seo: {
        defaultTitle: 'TireStore | A sua loja de pneus',
        defaultDescription: 'Compre pneus online com segurança e rapidez.'
      }
    },
    vehicleBrands: [...MOCK_VEHICLE_BRANDS],
    vehicleModels: [...MOCK_VEHICLE_MODELS],
    vehicleVersions: [...MOCK_VEHICLE_VERSIONS],
    vehicleFitments: [...MOCK_VEHICLE_FITMENTS]
  };
}

export class AdminLocalDB {
  private static instance: AdminLocalDB;
  private db: AdminDatabase | null = null;
  private isNode = typeof window === 'undefined' || process.env.NODE_ENV === 'test';

  private constructor() {}

  public static getInstance(): AdminLocalDB {
    if (!AdminLocalDB.instance) {
      AdminLocalDB.instance = new AdminLocalDB();
    }
    return AdminLocalDB.instance;
  }

  public async getDb(): Promise<AdminDatabase> {
    if (this.db) return this.db;

    if (!this.isNode) {
      // Very basic fallback if somehow called on client (should not happen in our Server Actions architecture)
      this.db = createInitialDb();
      return this.db;
    }

    try {
      if (fs.existsSync(FILE_PATH)) {
        const raw = fs.readFileSync(FILE_PATH, 'utf-8');
        const parsedDb = JSON.parse(raw) as AdminDatabase;
        
        // Migration V1 -> V2
        if (parsedDb.version === 1) {
          console.log("Migrating Admin DB from v1 to v2...");
          parsedDb.version = 2;
          parsedDb.sizes = parsedDb.sizes && parsedDb.sizes.length > 0 ? parsedDb.sizes : [...MOCK_TIRE_SIZES];
          parsedDb.vehicleBrands = [...MOCK_VEHICLE_BRANDS];
          parsedDb.vehicleModels = [...MOCK_VEHICLE_MODELS];
          parsedDb.vehicleVersions = [...MOCK_VEHICLE_VERSIONS];
          parsedDb.vehicleFitments = [...MOCK_VEHICLE_FITMENTS];
          this.db = parsedDb;
          this.saveDb();
          return this.db;
        }

        this.db = parsedDb;
        return this.db;
      }
    } catch (error) {
      console.error('Error reading Admin DB:', error);
    }

    // Initialize and save if not exists
    this.db = createInitialDb();
    this.saveDb();
    return this.db;
  }

  private saveDb() {
    if (!this.isNode || !this.db) return;
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error('Error saving Admin DB:', error);
    }
  }

  public async updateDb(updater: (db: AdminDatabase) => void): Promise<void> {
    const db = await this.getDb();
    updater(db);
    this.saveDb();
  }

  public async resetDb(): Promise<void> {
    this.db = createInitialDb();
    this.saveDb();
  }
}

export const adminDb = AdminLocalDB.getInstance();
