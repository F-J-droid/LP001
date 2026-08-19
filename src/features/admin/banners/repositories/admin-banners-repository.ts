import { SupabaseClient } from '@supabase/supabase-js';

export interface Banner {
  id: string;
  internal_name: string;
  headline?: string;
  subheadline?: string;
  image_url: string;
  cta_label?: string;
  cta_url?: string;
  position: 'home_hero' | 'home_promo_1' | 'home_promo_2' | 'catalog_banner';
  priority: number;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export class AdminBannersRepository {
  constructor(private client: SupabaseClient) {}

  async list(): Promise<Banner[]> {
    const { data, error } = await this.client
      .from('banners')
      .select('*')
      .order('position', { ascending: true })
      .order('priority', { ascending: false });

    if (error) throw error;
    return data as Banner[];
  }

  async getById(id: string): Promise<Banner | null> {
    const { data, error } = await this.client
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Banner;
  }

  async create(data: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner> {
    const { data: result, error } = await this.client
      .from('banners')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result as Banner;
  }

  async update(id: string, data: Partial<Omit<Banner, 'id' | 'created_at' | 'updated_at'>>): Promise<Banner> {
    const { data: result, error } = await this.client
      .from('banners')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as Banner;
  }

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await this.client
      .from('banners')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
