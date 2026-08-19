import { getAdminProducts } from '@/features/admin/services/admin-service';
import { StockTable } from '@/features/admin/components/stock-table';

export default async function AdminStockPage() {
  const products = await getAdminProducts();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">Gerenciamento rápido de inventário.</p>
        </div>
      </div>

      <StockTable 
        products={products} 
        lowStockThreshold={5}
      />
    </div>
  );
}
