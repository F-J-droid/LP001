import { getAdminProducts } from '@/features/admin/services/admin-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertCircle, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/features/products/utils/formatters';

export default async function AdminDashboardPage() {
  const products = await getAdminProducts();
  
  const activeProducts = products.filter(p => p.isActive !== false).length;
  const outOfStock = products.filter(p => (p.stockQuantity ?? 0) <= 0).length;
  const totalOrders = 0; // Mocked for now
  
  const catalogValue = products.reduce((acc, p) => {
    return acc + ((p.pixPrice ?? p.price) * (p.stockQuantity || 0));
  }, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua operação.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/produtos/novo">Novo Produto</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/promocoes/nova">Nova Promoção</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">No catálogo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Simulados</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Apenas demonstrativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(catalogValue)}</div>
            <p className="text-xs text-muted-foreground">Estimativa bruta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atenção Necessária</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outOfStock > 0 ? (
                <div className="flex items-center gap-4 border p-4 rounded-lg bg-destructive/5 border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">Produtos Esgotados</p>
                    <p className="text-xs text-muted-foreground">Existem {outOfStock} produtos sem estoque.</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/estoque">Atualizar</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 border p-4 rounded-lg bg-green-500/5 border-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-600">Estoque Saudável</p>
                    <p className="text-xs text-muted-foreground">Nenhum produto está esgotado no momento.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
