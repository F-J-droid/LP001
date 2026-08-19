'use server';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function cancelOrderAction(formData: FormData) {
  const orderId = formData.get('orderId') as string;
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  // Use the admin client to call the privileged RPC
  const adminClient = getSupabaseAdmin();
  const { error } = await adminClient.rpc('cancel_pending_order', {
    p_order_id: orderId
  });

  if (error) {
    console.error('[Admin] Error cancelling order:', error);
    throw new Error('Failed to cancel order: ' + error.message);
  }

  // Revalidate the pages to reflect the status change
  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${orderId}`);
}
