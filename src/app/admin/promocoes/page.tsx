import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminPromotionsRepository } from '@/features/admin/promotions/repositories/admin-promotions-repository';
import { PromotionList } from './components/promotion-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPromotionsPage() {
  const supabase = await requireAdmin();
  const repo = new AdminPromotionsRepository(supabase);
  const promotions = await repo.list();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Promoções</h1>
          <p className="text-muted-foreground">Gerencie campanhas e regras de desconto.</p>
        </div>
        <Link href="/admin/promocoes/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>
        </Link>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100">
        <strong>Aviso:</strong> O Promotion engine no Storefront ainda não está conectado. O gerenciamento aqui apenas grava no banco de dados e não altera o preço calculado no frontend nesta fase.
      </div>

      <PromotionList promotions={promotions} />
    </div>
  );
}
