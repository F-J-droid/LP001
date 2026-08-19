import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminBannersRepository } from '@/features/admin/banners/repositories/admin-banners-repository';
import { BannerList } from './components/banner-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminBannersPage() {
  const supabase = await requireAdmin();
  const repo = new AdminBannersRepository(supabase);
  const banners = await repo.list();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Banners</h1>
          <p className="text-muted-foreground">Gerencie banners da Home e Catálogo.</p>
        </div>
        <Link href="/admin/banners/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Banner
          </Button>
        </Link>
      </div>

      <BannerList banners={banners} />
    </div>
  );
}
