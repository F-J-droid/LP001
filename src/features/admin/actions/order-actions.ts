'use server';

import { requireAdmin } from '@/features/admin/utils/require-admin';
import { revalidatePath } from 'next/cache';

export async function cancelOrderAction(formData: FormData) {
  // Ensure only authenticated admins can access this action
  const supabase = await requireAdmin();

  const orderId = formData.get('orderId') as string;
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const { error } = await supabase.rpc('cancel_pending_order', {
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
