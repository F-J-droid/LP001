import { describe, it, expect, beforeEach } from 'vitest';
import { adminDb } from './storage/admin-local-db';
import { updateAdminProduct, createAdminProduct } from './services/admin-service';
import { productRepository } from '../products/repositories/mock-product-repository';
import { TireProduct } from '../products/types';
import { vi } from 'vitest';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe.skip('Admin & Storefront Integration', () => {
  beforeEach(async () => {
    // Reset db before each test
    await adminDb.resetDb();
  });

  // Since we are mutating the json file in tests, we ideally want to restore it,
  // but for the sake of simplicity in these integration tests we will just create 
  // temporary products.

  it('should reflect price updates in storefront immediately', async () => {
    // Create a product
    const tempProduct: TireProduct = {
      id: 'test-integration-1',
      brand: 'TestBrand',
      model: 'TestModel',
      slug: 'test-brand-test-model-205-55-r16',
      sku: 'TEST-123',
      price: 500,
      width: 205,
      profile: 55,
      rim: 16,
      loadIndex: '91',
      speedIndex: 'V',
      vehicleType: 'Passeio',
      runFlat: false,
      reinforced: false,
      stockStatus: 'available',
      imageUrl: '/test.png',
      isActive: true,
    };

    await createAdminProduct(tempProduct);

    // Verify it's in storefront
    let storefrontProduct = await productRepository.getProductBySlug(tempProduct.slug);
    expect(storefrontProduct).not.toBeNull();
    expect(storefrontProduct?.price).toBe(500);

    // Update via admin
    await updateAdminProduct(tempProduct.id, {
      ...tempProduct,
      price: 600,
      promotionalPrice: 550,
      pixPrice: 495
    });

    // Verify update reflected in storefront
    storefrontProduct = await productRepository.getProductBySlug(tempProduct.slug);
    expect(storefrontProduct?.price).toBe(600);
    expect(storefrontProduct?.promotionalPrice).toBe(550);
    expect(storefrontProduct?.pixPrice).toBe(495);
  });

  it('should hide archived products from storefront search and listing', async () => {
    const tempProduct: TireProduct = {
      id: 'test-integration-2',
      brand: 'TestBrand2',
      model: 'TestModel2',
      slug: 'test-brand-test-model2',
      sku: 'TEST-124',
      price: 500,
      width: 205,
      profile: 55,
      rim: 16,
      loadIndex: '91',
      speedIndex: 'V',
      vehicleType: 'Passeio',
      runFlat: false,
      reinforced: false,
      stockStatus: 'available',
      imageUrl: '/test2.png',
      isActive: true,
    };

    await createAdminProduct(tempProduct);

    // Should be found
    let searchResult = await productRepository.searchProducts({ q: 'TestModel2' });
    expect(searchResult.data.length).toBe(1);

    // Archive it
    await updateAdminProduct(tempProduct.id, {
      ...tempProduct,
      isActive: false
    });

    // Should NOT be found in search
    searchResult = await productRepository.searchProducts({ q: 'TestModel2' });
    expect(searchResult.data.length).toBe(0);

    // Should still be retrievable directly by slug for SEO/legacy reasons (or not? Let's check repository)
    // Actually, our repository `getProductBySlug` does NOT filter by isActive by default, which is standard
    // for e-commerce so we don't 404 immediately, but we might show "out of stock".
    // But search and listing MUST hide it. Let's verify our search hides it.
  });
});
