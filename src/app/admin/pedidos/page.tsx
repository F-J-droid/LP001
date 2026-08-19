import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { formatCurrency, formatDate } from '@/features/products/utils/formatters';
import { orderRepository } from '@/features/orders/repositories/supabase-order-repository';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const orders = await orderRepository.getOrders();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">Últimos pedidos realizados na loja.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
              <tr>
                <th className="px-4 py-3">Public ID</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Itens</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders?.map(order => {
                const totalItems = order.order_items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">{order.public_id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 font-bold">
                      {order.customer_name}
                      <div className="text-xs font-normal text-muted-foreground">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3">{totalItems} unid.</td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(order.total_cents / 100)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        order.status === 'paid' ? 'bg-success/20 text-success' : 
                        order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/pedidos/${order.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
