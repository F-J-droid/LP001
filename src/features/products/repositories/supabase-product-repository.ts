import { ProductRepository, ProductSearchParams, ProductSortOption, PaginatedResult } from './product-repository';
import { TireProduct, TireBrand, TireCategory, TireBadge } from '../types';
import { createClient } from '@/lib/supabase/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseProductToDomain(row: any): TireProduct {
  const model = row.tire_models;
  const brand = model?.tire_brands;
  const size = row.tire_sizes;
  const priceData = (Array.isArray(row.prices) ? row.prices[0] : row.prices) || {};
  const inventoryData = (Array.isArray(row.inventory) ? row.inventory[0] : row.inventory) || { quantity: 0 };
  
  // Resolve badges
  const badges: TireBadge[] = [];
  if (row.is_featured) badges.push('Oferta');
  if (row.is_best_seller) badges.push('Mais vendido');
  if (row.is_new) badges.push('Lançamento');

  // Resolve images
  const images = row.product_images || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryImage = images.find((i: any) => i.is_primary)?.url || images[0]?.url || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gallery = images.map((i: any) => i.url);

  // Stock status
  let stockStatus: TireProduct['stockStatus'] = 'out_of_stock';
  if (inventoryData.quantity > 0) {
    if (inventoryData.quantity <= (inventoryData.low_stock_threshold || 5)) {
      stockStatus = 'low_stock';
    } else {
      stockStatus = 'available';
    }
  }

  // Prices
  const regularPrice = (priceData.regular_price_cents || 0) / 100;
  const salePrice = priceData.sale_price_cents ? priceData.sale_price_cents / 100 : undefined;
  const pixPrice = priceData.pix_price_cents ? priceData.pix_price_cents / 100 : undefined;

  return {
    id: row.id,
    slug: model?.slug ? `${model.slug}-${size.width}-${size.profile}-r${size.rim}` : row.id,
    sku: row.sku,
    brand: brand?.name || '',
    model: model?.name || '',
    width: size?.width || 0,
    profile: size?.profile || 0,
    rim: size?.rim || 0,
    loadIndex: row.load_index || '',
    speedIndex: row.speed_index || '',
    vehicleType: model?.vehicle_type || '',
    runFlat: row.run_flat || false,
    reinforced: row.reinforced || false,
    price: regularPrice,
    promotionalPrice: salePrice,
    pixPrice: pixPrice || (salePrice || regularPrice) * 0.9,
    installmentCount: 10,
    installmentValue: (salePrice || regularPrice) / 10,
    stockStatus,
    stockQuantity: inventoryData.quantity,
    rating: 4.8, // Static for now, could be added to DB later
    reviewCount: Math.floor(Math.random() * 100) + 10, // Mocked
    imageUrl: primaryImage,
    gallery: gallery.length > 0 ? gallery : [primaryImage],
    badges,
    freeShipping: row.free_shipping || false,
    description: model?.description || '',
    warrantyMonths: row.warranty_months || 60,
    ean: row.ean || '',
    inmetroCode: row.inmetro_code || '',
    efficiency: row.efficiency || '',
    wetGrip: row.wet_grip || '',
    externalNoiseDb: row.external_noise_db || 0,
    isActive: row.is_active,
  };
}

const SELECT_QUERY = `
  id, sku, load_index, speed_index, run_flat, reinforced, is_featured, is_best_seller, is_new, free_shipping, is_active,
  ean, inmetro_code, efficiency, wet_grip, external_noise_db, warranty_months,
  tire_models(name, slug, description, vehicle_type, tire_brands(name, slug)),
  tire_sizes(width, profile, rim),
  prices(regular_price_cents, sale_price_cents, pix_price_cents),
  inventory(quantity, low_stock_threshold),
  product_images(url, is_primary, position)
`;

export class SupabaseProductRepository implements ProductRepository {
  
  async getAllProducts(page = 1, limit = 12): Promise<PaginatedResult<TireProduct>> {
    const supabase = createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('tire_variants')
      .select(SELECT_QUERY, { count: 'exact' })
      .eq('is_active', true)
      .range(from, to);

    if (error) {
      console.error('Error fetching products:', error);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    return {
      data: data.map(mapSupabaseProductToDomain),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getProductBySlug(slug: string): Promise<TireProduct | null> {
    const supabase = createClient();
    
    // We construct the slug in frontend as: brand-model-width-profile-rRim
    // To find it accurately in Supabase without a dedicated slug column on variants, we can query all active and match locally,
    // OR just use a simpler query. For now, since variant slugs might not be 1:1, we'll fetch a batch.
    // Better approach: fetch the model by slug part, then match size.
    // Let's assume we can fetch all and filter for now to be safe and compatible with the mock.
    // In a real optimized scenario, we would parse the slug or add a unique slug column to tire_variants.
    
    // Let's parse it: michelin-primacy-4-plus-205-55-r16
    const parts = slug.split('-');
    const rPart = parts[parts.length - 1]; // r16
    const rimStr = rPart.replace('r', '');
    const profileStr = parts[parts.length - 2];
    const widthStr = parts[parts.length - 3];
    
    let query = supabase
      .from('tire_variants')
      .select(SELECT_QUERY)
      .eq('is_active', true);

    if (!isNaN(Number(rimStr)) && !isNaN(Number(profileStr)) && !isNaN(Number(widthStr))) {
      const { data: sizeData } = await supabase.from('tire_sizes').select('id').eq('width', Number(widthStr)).eq('profile', Number(profileStr)).eq('rim', Number(rimStr)).single();
      if (sizeData) {
        query = query.eq('tire_size_id', sizeData.id);
      }
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) return null;

    // Find exact match by generated slug
    const domainProducts = data.map(mapSupabaseProductToDomain);
    return domainProducts.find(p => p.slug === slug) || domainProducts[0];
  }

  async searchProducts(params: ProductSearchParams, sort?: ProductSortOption, page = 1, limit = 12): Promise<PaginatedResult<TireProduct>> {
    const supabase = createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('tire_variants')
      .select(SELECT_QUERY, { count: 'exact' })
      .eq('is_active', true);

    // Since we are filtering by relations, PostgREST syntax allows it:
    if (params.width) query = query.eq('tire_sizes.width', params.width);
    if (params.profile) query = query.eq('tire_sizes.profile', params.profile);
    if (params.rim) query = query.eq('tire_sizes.rim', params.rim);
    
    // For brand and category, PostgREST filtering on joined tables can be tricky if we want to drop rows.
    // Using !inner helps filter the parent row based on child match.
    // We'll update the select query for search if needed, but standard select doesn't use !inner.
    // So we fetch all matching and filter if needed, OR we construct a dedicated query.
    // To keep it simple and robust, let's just fetch everything and filter locally if params.brand is set.
    // In production, we'd use !inner joins or a PostgreSQL view.
    
    const { data, error } = await query;
    if (error || !data) return { data: [], total: 0, page, limit, totalPages: 0 };

    let filtered = data.map(mapSupabaseProductToDomain);

    if (params.brand) filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand?.toLowerCase());
    if (params.category) filtered = filtered.filter(p => p.vehicleType.toLowerCase() === params.category?.toLowerCase());
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(p => p.model.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    
    // Sort
    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'best_seller') filtered.sort((a, b) => (b.badges?.includes('Mais vendido') ? 1 : 0) - (a.badges?.includes('Mais vendido') ? 1 : 0));
    
    const paginated = filtered.slice(from, to + 1);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  }

  async getFeaturedProducts(limit = 4): Promise<TireProduct[]> {
    const supabase = createClient();
    const { data } = await supabase
      .from('tire_variants')
      .select(SELECT_QUERY)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(limit);
    return (data || []).map(mapSupabaseProductToDomain);
  }

  async getBestSellingProducts(limit = 4): Promise<TireProduct[]> {
    const supabase = createClient();
    const { data } = await supabase
      .from('tire_variants')
      .select(SELECT_QUERY)
      .eq('is_active', true)
      .eq('is_best_seller', true)
      .limit(limit);
    return (data || []).map(mapSupabaseProductToDomain);
  }

  async getSimilarProducts(productId: string, limit = 4): Promise<TireProduct[]> {
    // Return random active products for now
    const supabase = createClient();
    const { data } = await supabase
      .from('tire_variants')
      .select(SELECT_QUERY)
      .eq('is_active', true)
      .neq('id', productId)
      .limit(limit);
    return (data || []).map(mapSupabaseProductToDomain);
  }

  async getAllBrands(): Promise<TireBrand[]> {
    const supabase = createClient();
    const { data } = await supabase.from('tire_brands').select('*').eq('is_active', true);
    return (data || []).map(b => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      isActive: b.is_active,
      logoUrl: b.logo_url
    }));
  }

  async getAllCategories(): Promise<TireCategory[]> {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').eq('is_active', true);
    return (data || []).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isActive: c.is_active
    }));
  }

  async getAvailableRims(): Promise<number[]> {
    const supabase = createClient();
    const { data } = await supabase.from('tire_sizes').select('rim');
    if (!data) return [];
    const rims = Array.from(new Set(data.map(s => s.rim))).sort((a, b) => a - b);
    return rims;
  }
}

export const productRepository = new SupabaseProductRepository();
