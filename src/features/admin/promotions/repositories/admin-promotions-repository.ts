import { SupabaseClient } from '@supabase/supabase-js';

export interface Promotion {
  id: string;
  name: string;
  slug: string;
  type: 'percentage' | 'fixed_amount' | 'fixed_price';
  value: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export class AdminPromotionsRepository {
  constructor(private client: SupabaseClient) {}

  async list(): Promise<Promotion[]> {
    const { data, error } = await this.client
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Promotion[];
  }

  async getById(id: string): Promise<Promotion | null> {
    const { data, error } = await this.client
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Promotion;
  }

  async create(data: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>): Promise<Promotion> {
    const { data: result, error } = await this.client
      .from('promotions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result as Promotion;
  }

  async update(id: string, data: Partial<Omit<Promotion, 'id' | 'created_at' | 'updated_at'>>): Promise<Promotion> {
    const { data: result, error } = await this.client
      .from('promotions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as Promotion;
  }

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await this.client
      .from('promotions')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  }
}

// Derived Status Helper
export function getPromotionStatus(promo: Promotion): 'scheduled' | 'active' | 'expired' | 'inactive' {
  if (!promo.is_active) return 'inactive';
  
  const now = new Date();
  const startsAt = new Date(promo.starts_at);
  const endsAt = new Date(promo.ends_at);

  if (now < startsAt) return 'scheduled';
  if (now > endsAt) return 'expired';
  return 'active';
}
