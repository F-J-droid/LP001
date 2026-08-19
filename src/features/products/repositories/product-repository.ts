import { TireProduct, TireBrand, TireCategory } from '../types';

export interface ProductSearchParams {
  q?: string;
  brand?: string;
  category?: string;
  width?: number;
  profile?: number;
  rim?: number;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductSortOption = 
  | 'relevance' 
  | 'price_asc' 
  | 'price_desc' 
  | 'best_seller' 
  | 'best_rated' 
  | 'newest';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductRepository {
  getAllProducts(page?: number, limit?: number): Promise<PaginatedResult<TireProduct>>;
  getProductBySlug(slug: string): Promise<TireProduct | null>;
  searchProducts(params: ProductSearchParams, sort?: ProductSortOption, page?: number, limit?: number): Promise<PaginatedResult<TireProduct>>;
  getFeaturedProducts(limit?: number): Promise<TireProduct[]>;
  getBestSellingProducts(limit?: number): Promise<TireProduct[]>;
  getSimilarProducts(productId: string, limit?: number): Promise<TireProduct[]>;
  getAllBrands(): Promise<TireBrand[]>;
  getAllCategories(): Promise<TireCategory[]>;
  getAvailableRims(): Promise<number[]>;
}
