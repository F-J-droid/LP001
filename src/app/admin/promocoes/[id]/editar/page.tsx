import { PromotionForm } from '../../components/promotion-form';
import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminPromotionsRepository } from '@/features/admin/promotions/repositories/admin-promotions-repository';
import { notFound } from 'next/navigation';

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin();
  const repo = new AdminPromotionsRepository(supabase);
  const promo = await repo.getById(id);

  if (!promo) {
    notFound();
  }

  return (
    <div>
      <PromotionForm initialData={promo} />
    </div>
  );
}
