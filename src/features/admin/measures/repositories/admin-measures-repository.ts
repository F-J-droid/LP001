/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from '@supabase/supabase-js';

export interface TireSize {
  id: string;
  width: number;
  profile: number;
  rim: number;
  created_at?: string;
  usageCount?: number;
}

export class AdminMeasuresRepository {
  constructor(private client: SupabaseClient) {}

  async list(): Promise<TireSize[]> {
    // Left join ou count com postgrest (neste caso, fazemos de forma simples buscando tudo e agrupando, ou duas queries caso precise ser muito performático)
    // Para simplificar:
    const { data: sizes, error } = await this.client
      .from('tire_sizes')
      .select('*')
      .order('rim', { ascending: true })
      .order('width', { ascending: true });

    if (error) throw error;

    // Buscar uso (agregação) - uma forma eficiente para datasets pequenos/médios
    const { data: variants, error: countError } = await this.client
      .from('tire_variants')
      .select('tire_size_id');
      
    if (countError) throw countError;

    const usageMap = new Map<string, number>();
    variants.forEach(v => {
      usageMap.set(v.tire_size_id, (usageMap.get(v.tire_size_id) || 0) + 1);
    });

    return sizes.map((s: any) => ({
      ...s,
      usageCount: usageMap.get(s.id) || 0
    }));
  }

  async create(data: Omit<TireSize, 'id' | 'created_at' | 'usageCount'>): Promise<TireSize> {
    const { data: result, error } = await this.client
      .from('tire_sizes')
      .insert([data])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Esta medida já está cadastrada.');
      }
      throw error;
    }

    return result as TireSize;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('tire_sizes')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        throw new Error('Esta medida está em uso e não pode ser removida.');
      }
      throw error;
    }
  }
}

