import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseProductRepository } from './supabase-product-repository';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn((resolve) => resolve({ data: [], error: null, count: 0 }))
    }))
  }))
}));

describe('SupabaseProductRepository', () => {
  let repo: SupabaseProductRepository;

  beforeEach(() => {
    repo = new SupabaseProductRepository();
    vi.clearAllMocks();
  });

  it('getAllProducts should return paginated result', async () => {
    const result = await repo.getAllProducts(1, 10);
    expect(result.data).toBeDefined();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it('searchProducts should handle empty query', async () => {
    const result = await repo.searchProducts({});
    expect(result.data).toBeDefined();
  });

  it('getAllBrands should return array', async () => {
    const result = await repo.getAllBrands();
    expect(Array.isArray(result)).toBe(true);
  });
});
