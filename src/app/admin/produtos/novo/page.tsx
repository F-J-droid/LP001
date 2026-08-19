import { ProductForm } from '@/features/admin/components/product-form';
import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminMeasuresRepository } from '@/features/admin/measures/repositories/admin-measures-repository';

export default async function NewProductPage() {
  const supabase = await requireAdmin();
  const repo = new AdminMeasuresRepository(supabase);
  const measures = await repo.list();

  return (
    <div>
      <ProductForm availableMeasures={measures} />
    </div>
  );
}
