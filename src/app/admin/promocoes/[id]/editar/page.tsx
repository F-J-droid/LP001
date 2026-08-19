import { PromotionForm } from '../../components/promotion-form';
import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminPromotionsRepository } from '@/features/admin/promotions/repositories/admin-promotions-repository';
import { notFound } from 'next/navigation';

export default async function EditPromotionPage({ params }: { params: { id: string } }) {
  const supabase = await requireAdmin();
  const repo = new AdminPromotionsRepository(supabase);
  const promo = await repo.getById(params.id);

  if (!promo) {
    notFound();
  }

  return (
    <div>
      <PromotionForm initialData={promo} />
    </div>
  );
}
