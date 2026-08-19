import { notFound } from 'next/navigation';
import { orderRepository } from '@/features/orders/repositories/supabase-order-repository';
import { formatCurrency, formatDate } from '@/features/products/utils/formatters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PackageCheck, Truck, User, MapPin, Ban } from 'lucide-react';
import Link from 'next/link';
import { cancelOrderAction } from '@/features/admin/actions/order-actions';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order;
  try {
    order = await orderRepository.getOrderById(id);
  } catch {
    notFound();
  }

  if (!order) {
    notFound();
  }

  const isPending = order.status === 'pending_payment';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/pedidos">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Pedido <span className="text-primary">{order.public_id}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ml-2 ${
              order.status === 'paid' ? 'bg-success/20 text-success' : 
              order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
              'bg-warning/20 text-warning'
            }`}>
              {order.status}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">Criado em {formatDate(order.created_at)}</p>
        </div>
        
        {isPending && (
          <form action={cancelOrderAction} className="ml-auto">
            <input type="hidden" name="orderId" value={order.id} />
            <Button variant="destructive" type="submit" className="font-bold">
              <Ban className="w-4 h-4 mr-2" />
              Cancelar Pedido
            </Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <PackageCheck className="w-5 h-5 text-muted-foreground" /> Itens do Pedido
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item: { id: string; product_name: string; sku: string; size_label: string; subtotal_cents: number; quantity: number; unit_price_cents: number }) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-bold text-sm">{item.product_name}</div>
                    <div className="text-xs text-muted-foreground">SKU: {item.sku} | {item.size_label}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{formatCurrency(item.subtotal_cents / 100)}</div>
                    <div className="text-xs text-muted-foreground">{item.quantity}x {formatCurrency(item.unit_price_cents / 100)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal_cents / 100)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Frete ({order.shipping_method_name})</span>
                <span>{formatCurrency(order.shipping_cents / 100)}</span>
              </div>
              <div className="flex justify-between font-black text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total_cents / 100)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <Truck className="w-5 h-5 text-muted-foreground" /> Histórico de Status
            </h2>
            <div className="space-y-4">
              {order.order_status_history.map((hist: { id: string; created_at: string; to_status: string; note: string }) => (
                <div key={hist.id} className="flex gap-4 text-sm">
                  <div className="text-muted-foreground w-32 shrink-0">{formatDate(hist.created_at)}</div>
                  <div>
                    <span className="font-bold">{hist.to_status}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{hist.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <User className="w-5 h-5 text-muted-foreground" /> Cliente
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Nome</div>
                <div className="font-medium">{order.customer_name}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">CPF</div>
                <div className="font-medium">{order.customer_cpf}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">E-mail</div>
                <div className="font-medium">{order.customer_email}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Telefone</div>
                <div className="font-medium">{order.customer_phone}</div>
              </div>
            </div>
          </div>

          {order.order_addresses[0] && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
                <MapPin className="w-5 h-5 text-muted-foreground" /> Endereço
              </h2>
              <div className="text-sm space-y-1">
                <div className="font-bold">{order.order_addresses[0].recipient_name}</div>
                <div>{order.order_addresses[0].street}, {order.order_addresses[0].number}</div>
                {order.order_addresses[0].complement && <div>{order.order_addresses[0].complement}</div>}
                <div>{order.order_addresses[0].district}</div>
                <div>{order.order_addresses[0].city} - {order.order_addresses[0].state}</div>
                <div>CEP: {order.order_addresses[0].postal_code}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
