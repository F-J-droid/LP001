import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Webhook Token (Optional but recommended for security)
    const token = req.headers.get('asaas-access-token');
    const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
    
    if (expectedToken && token !== expectedToken) {
      console.warn('[Asaas Webhook] Invalid token received');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Payload
    const body = await req.json();
    console.log(`[Asaas Webhook] Event received: ${body.event}`, body.payment?.id);

    const { event, payment } = body;
    if (!payment || !payment.id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3. Process Events
    // Asaas events: PAYMENT_RECEIVED, PAYMENT_CONFIRMED, PAYMENT_REFUNDED, etc.
    let newPaymentStatus: string | null = null;
    let newOrderStatus: string | null = null;

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      newPaymentStatus = 'paid';
      newOrderStatus = 'processing';
    } else if (event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_DELETED' || event === 'PAYMENT_OVERDUE') {
      newPaymentStatus = event === 'PAYMENT_REFUNDED' ? 'refunded' : 'failed';
      newOrderStatus = 'cancelled';
    }

    if (!newPaymentStatus) {
      // Event not relevant for updating status (e.g., PAYMENT_CREATED)
      return NextResponse.json({ received: true });
    }

    // 4. Update Database
    const adminClient = getSupabaseAdmin();
    
    // Find order by external_payment_id
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('id, status, payment_status')
      .eq('external_payment_id', payment.id)
      .single();

    if (orderError || !order) {
      console.error(`[Asaas Webhook] Order not found for payment ID: ${payment.id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order statuses
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        payment_status: newPaymentStatus,
        status: newOrderStatus || order.status,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error(`[Asaas Webhook] Error updating order ${order.id}:`, updateError);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Insert History Log
    await adminClient.from('order_status_history').insert({
      order_id: order.id,
      from_status: order.status,
      to_status: newOrderStatus || order.status,
      note: `Status atualizado via Asaas Webhook (${event})`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Asaas Webhook] Exception processing webhook', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
