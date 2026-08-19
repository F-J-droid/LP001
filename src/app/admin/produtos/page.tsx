import { getAdminProducts } from '@/features/admin/services/admin-service';
import { Button } from '@/components/ui/button';
import { Plus, Search, MoreHorizontal, Pencil, Copy, Archive } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/features/products/utils/formatters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de pneus.</p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por nome, SKU ou marca..." 
              className="w-full pl-9 pr-4 h-10 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>Status: Todos</option>
            <option>Ativos</option>
            <option>Arquivados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
              <tr>
                <th className="px-4 py-3">Imagem</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Medida</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(product => {
                const inventoryAmount = product.stockQuantity ?? 0;
                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-white rounded-md border flex items-center justify-center p-1">
                        <Image src={product.imageUrl} alt={product.model} width={40} height={40} className="object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/admin/produtos/${product.id}/editar`} className="hover:underline">
                        {product.brand} {product.model}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {product.width}/{product.profile} R{product.rim}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatCurrency(product.pixPrice ?? product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${inventoryAmount > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {inventoryAmount} un
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.isActive !== false ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Ativo</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Arquivado</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/admin/produtos/${product.id}/editar`} className="flex items-center w-full">
                              <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/produto/${product.slug}`} target="_blank" className="flex items-center w-full">
                              <Search className="w-4 h-4 mr-2" /> Visualizar na loja
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Archive className="w-4 h-4 mr-2" /> Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
