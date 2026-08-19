import { ProductRepository, ProductSearchParams, ProductSortOption, PaginatedResult } from './product-repository';
import { TireProduct, TireBrand, TireCategory } from '../types';
import { adminDb } from '@/features/admin/storage/admin-local-db';

export class MockProductRepository implements ProductRepository {
  private async getActiveProducts(): Promise<TireProduct[]> {
    const db = await adminDb.getDb();
    return db.products.filter(p => p.isActive !== false);
  }

  private async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAllProducts(page: number = 1, limit: number = 12): Promise<PaginatedResult<TireProduct>> {
    const products = await this.getActiveProducts();
    return this.paginate(products, page, limit);
  }

  async getProductBySlug(slug: string): Promise<TireProduct | null> {
    const products = await this.getActiveProducts();
    return products.find(p => p.slug === slug) || null;
  }

  async searchProducts(params: ProductSearchParams, sort: ProductSortOption = 'relevance', page: number = 1, limit: number = 12): Promise<PaginatedResult<TireProduct>> {
    let filtered = await this.getActiveProducts();

    if (params.q) {
      const q = params.q.toLowerCase().trim();
      const normalize = (s: string) => s.replace(/[^a-z0-9]/g, '');
      const qNorm = normalize(q);
      
      filtered = filtered.filter(p => {
        const fullDesc = `${p.brand} ${p.model} ${p.width} ${p.profile} ${p.rim}`.toLowerCase();
        return fullDesc.includes(q) || normalize(fullDesc).includes(qNorm);
      });
    }

    if (params.brand) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params.category) {
      filtered = filtered.filter(p => p.vehicleType.toLowerCase() === params.category?.toLowerCase());
    }
    if (params.width) {
      filtered = filtered.filter(p => p.width === params.width);
    }
    if (params.profile) {
      filtered = filtered.filter(p => p.profile === params.profile);
    }
    if (params.rim) {
      filtered = filtered.filter(p => p.rim === params.rim);
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter(p => (p.pixPrice ?? p.price) >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(p => (p.pixPrice ?? p.price) <= params.maxPrice!);
    }

    filtered.sort((a, b) => {
      const priceA = a.pixPrice ?? a.price;
      const priceB = b.pixPrice ?? b.price;

      switch (sort) {
        case 'price_asc': return priceA - priceB;
        case 'price_desc': return priceB - priceA;
        case 'best_seller': return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
        case 'best_rated': return (b.rating ?? 0) - (a.rating ?? 0);
        case 'newest': return b.badges?.includes('Lançamento') ? 1 : -1;
        case 'relevance':
        default:
          if (a.stockStatus !== b.stockStatus) return a.stockStatus === 'available' ? -1 : 1;
          return 0;
      }
    });

    return this.paginate(filtered, page, limit);
  }

  async getFeaturedProducts(limit: number = 4): Promise<TireProduct[]> {
    const products = await this.getActiveProducts();
    return products.filter(p => p.badges?.includes('Oferta')).slice(0, limit);
  }

  async getBestSellingProducts(): Promise<TireProduct[]> {
    const products = await this.getActiveProducts();
    return products.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)).slice(0, 4);
  }

  async getAllBrands(): Promise<TireBrand[]> {
    const db = await adminDb.getDb();
    return db.brands;
  }

  async getAllCategories(): Promise<TireCategory[]> {
    const db = await adminDb.getDb();
    return db.categories;
  }

  async getAvailableRims(): Promise<number[]> {
    const products = await this.getActiveProducts();
    return Array.from(new Set(products.map(p => p.rim))).sort((a, b) => a - b);
  }

  async getSimilarProducts(productId: string, limit: number = 4): Promise<TireProduct[]> {
    const products = await this.getActiveProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    let similar = products.filter(p => 
      p.id !== product.id && 
      p.width === product.width && 
      p.profile === product.profile && 
      p.rim === product.rim
    );

    if (similar.length < limit) {
      const more = products.filter(p => 
        p.id !== product.id && 
        p.rim === product.rim && 
        p.vehicleType === product.vehicleType &&
        !similar.find(s => s.id === p.id)
      );
      similar = [...similar, ...more];
    }

    if (similar.length < limit) {
      const evenMore = products.filter(p => 
        p.id !== product.id && 
        p.vehicleType === product.vehicleType &&
        !similar.find(s => s.id === p.id)
      );
      similar = [...similar, ...evenMore];
    }

    return similar.slice(0, limit);
  }

  private paginate(items: TireProduct[], page: number, limit: number): PaginatedResult<TireProduct> {
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);
    return {
      data: paginatedItems,
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit)
    };
  }
}

// Export a singleton instance
export const productRepository = new MockProductRepository();
