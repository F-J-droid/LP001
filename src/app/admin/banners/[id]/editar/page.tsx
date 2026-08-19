import { BannerForm } from '../../components/banner-form';
import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminBannersRepository } from '@/features/admin/banners/repositories/admin-banners-repository';
import { notFound } from 'next/navigation';

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const supabase = await requireAdmin();
  const repo = new AdminBannersRepository(supabase);
  const banner = await repo.getById(params.id);

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <BannerForm initialData={banner} />
    </div>
  );
}
