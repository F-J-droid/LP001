import { describe, it, expect } from 'vitest';
import { productRepository } from './mock-product-repository';

describe('MockProductRepository', () => {
  it('should get all products paginated', async () => {
    const result = await productRepository.getAllProducts(1, 10);
    expect(result.data.length).toBeLessThanOrEqual(10);
    expect(result.page).toBe(1);
    expect(result.total).toBeGreaterThan(0);
    expect(result.totalPages).toBeGreaterThan(0);
  });

  it('should find a product by slug', async () => {
    const products = await productRepository.getAllProducts(1, 1);
    const slug = products.data[0].slug;
    
    const product = await productRepository.getProductBySlug(slug);
    expect(product).not.toBeNull();
    expect(product?.slug).toBe(slug);
  });

  it('should return null for non-existent slug', async () => {
    const product = await productRepository.getProductBySlug('non-existent-slug-123');
    expect(product).toBeNull();
  });

  it('should search products by text query', async () => {
    const result = await productRepository.searchProducts({ q: 'michelin' });
    expect(result.data.every(p => p.brand.toLowerCase() === 'michelin' || p.model.toLowerCase().includes('michelin'))).toBe(true);
  });

  it('should filter products by exact brand', async () => {
    const result = await productRepository.searchProducts({ brand: 'Pirelli' });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every(p => p.brand === 'Pirelli')).toBe(true);
  });

  it('should filter products by measure (width, profile, rim)', async () => {
    // Assuming we have 205 55 16 in the mock data
    const result = await productRepository.searchProducts({ width: 205, profile: 55, rim: 16 });
    expect(result.data.every(p => p.width === 205 && p.profile === 55 && p.rim === 16)).toBe(true);
  });

  it('should filter products by price range', async () => {
    const result = await productRepository.searchProducts({ minPrice: 400, maxPrice: 600 });
    expect(result.data.every(p => {
      const price = p.pixPrice ?? p.price;
      return price >= 400 && price <= 600;
    })).toBe(true);
  });

  it('should sort products by price ascending', async () => {
    const result = await productRepository.searchProducts({}, 'price_asc');
    const prices = result.data.map(p => p.pixPrice ?? p.price);
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  it('should return featured products', async () => {
    const featured = await productRepository.getFeaturedProducts();
    expect(featured.length).toBeLessThanOrEqual(4);
    expect(featured.every(p => p.badges?.includes('Oferta'))).toBe(true);
  });

  it('should return similar products', async () => {
    const products = await productRepository.getAllProducts(1, 1);
    const product = products.data[0];
    
    const similar = await productRepository.getSimilarProducts(product.id, 4);
    expect(similar.length).toBeLessThanOrEqual(4);
    expect(similar.every(p => p.id !== product.id)).toBe(true);
  });
});
