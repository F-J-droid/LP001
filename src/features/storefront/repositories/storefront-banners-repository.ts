import { SupabaseClient } from '@supabase/supabase-js';
import { Banner } from '@/features/admin/banners/repositories/admin-banners-repository';

export class StorefrontBannersRepository {
  constructor(private client: SupabaseClient) {}

  async getHeroBanners(): Promise<Banner[]> {
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from('banners')
      .select('*')
      .eq('position', 'home_hero')
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching hero banners:', error);
      return [];
    }

    return data as Banner[];
  }
}
