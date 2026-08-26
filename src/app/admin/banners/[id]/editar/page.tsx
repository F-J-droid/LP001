import { BannerForm } from '../../components/banner-form';
import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminBannersRepository } from '@/features/admin/banners/repositories/admin-banners-repository';
import { notFound } from 'next/navigation';

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin();
  const repo = new AdminBannersRepository(supabase);
  const banner = await repo.getById(id);

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <BannerForm initialData={banner} />
    </div>
  );
}
