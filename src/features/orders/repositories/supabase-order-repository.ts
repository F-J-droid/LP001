import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';

export class SupabaseOrderRepository {
  async getOrders() {
    const supabase = await createClient();
    
    // Admins can view all orders due to RLS policies
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        public_id,
        customer_name,
        customer_email,
        customer_phone,
        total_cents,
        status,
        payment_status,
        created_at,
        order_items (
          quantity
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseOrderRepository] Error fetching orders', error);
      throw error;
    }

    return data;
  }

  async getOrderById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        order_addresses (*),
        order_status_history (
          id,
          from_status,
          to_status,
          note,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('[SupabaseOrderRepository] Error fetching order details', error);
      throw error;
    }

    return data;
  }
}

export const orderRepository = new SupabaseOrderRepository();
