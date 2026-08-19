/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from '@supabase/supabase-js';

export class AdminSettingsRepository {
  constructor(private client: SupabaseClient) {}

  async getSection(key: string): Promise<any> {
    const { data, error } = await this.client
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data?.value;
  }

  async updateSection(key: string, value: any): Promise<void> {
    const exists = await this.getSection(key);
    
    if (exists !== null) {
      const { error } = await this.client
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      if (error) throw error;
    } else {
      const { error } = await this.client
        .from('site_settings')
        .insert([{ key, value }]);
      if (error) throw error;
    }
  }

  async getAll(): Promise<Record<string, any>> {
    const { data, error } = await this.client
      .from('site_settings')
      .select('*');

    if (error) throw error;
    
    const settings: Record<string, any> = {};
    if (data) {
      data.forEach((row: any) => {
        settings[row.key] = row.value;
      });
    }
    return settings;
  }
}

