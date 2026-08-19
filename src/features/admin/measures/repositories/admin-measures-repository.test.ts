/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminMeasuresRepository } from './admin-measures-repository';

describe('AdminMeasuresRepository', () => {
  let mockSupabaseClient: any;
  let repo: AdminMeasuresRepository;

  beforeEach(() => {
    // Basic mock builder for Supabase chain
    const mockChain = (methods: Record<string, any>) => {
      const chain: any = {};
      Object.keys(methods).forEach(key => {
        chain[key] = vi.fn().mockImplementation((...args) => {
          if (typeof methods[key] === 'function') {
            return methods[key](...args) || chain;
          }
          return methods[key];
        });
      });
      return chain;
    };

    mockSupabaseClient = {
      from: vi.fn()
    };
    
    repo = new AdminMeasuresRepository(mockSupabaseClient);
  });

  it('creates a measure successfully', async () => {
    const mockData = { id: '123', width: 205, profile: 55, rim: 16 };
    const selectChain = {
      single: vi.fn().mockResolvedValue({ data: mockData, error: null })
    };
    
    mockSupabaseClient.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(selectChain)
      })
    });

    const result = await repo.create({ width: 205, profile: 55, rim: 16 });
    expect(result).toEqual(mockData);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('tire_sizes');
  });

  it('rejects duplicate measure', async () => {
    const selectChain = {
      single: vi.fn().mockResolvedValue({ data: null, error: { code: '23505' } })
    };
    
    mockSupabaseClient.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(selectChain)
      })
    });

    await expect(repo.create({ width: 205, profile: 55, rim: 16 }))
      .rejects.toThrow('Esta medida já está cadastrada.');
  });

  it('deletes a measure', async () => {
    mockSupabaseClient.from.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });

    await expect(repo.delete('123')).resolves.not.toThrow();
  });

  it('rejects deletion if measure is in use', async () => {
    mockSupabaseClient.from.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { code: '23503' } })
      })
    });

    await expect(repo.delete('123'))
      .rejects.toThrow('Esta medida está em uso e não pode ser removida.');
  });
});

