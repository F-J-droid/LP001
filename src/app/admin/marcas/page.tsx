import { productRepository } from '@/features/products/repositories/supabase-product-repository';
import { getAdminProducts } from '@/features/admin/services/admin-service';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';

export default async function AdminBrandsPage() {
  const brands = await productRepository.getAllBrands();
  const products = await getAdminProducts();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Marcas</h1>
          <p className="text-muted-foreground">Gerencie as marcas de pneus.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Marca
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Produtos</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands.map(brand => {
                const count = products.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase()).length;
                return (
                  <tr key={brand.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{brand.id.split('-')[0]}</td>
                    <td className="px-4 py-3 font-bold">{brand.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{brand.slug}</td>
                    <td className="px-4 py-3">{count}</td>
                    <td className="px-4 py-3">
                      {brand.isActive !== false ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Ativo</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Inativo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
