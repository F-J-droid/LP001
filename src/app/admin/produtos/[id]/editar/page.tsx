import { ProductForm } from '@/features/admin/components/product-form';
import { getAdminProducts } from '@/features/admin/services/admin-service';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminMeasuresRepository } from '@/features/admin/measures/repositories/admin-measures-repository';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getAdminProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  const initialData = {
    ...product,
    stockQuantity: product.stockQuantity || 0
  };

  const supabase = await requireAdmin();
  const repo = new AdminMeasuresRepository(supabase);
  const measures = await repo.list();

  return (
    <div>
      <ProductForm initialData={initialData} availableMeasures={measures} />
    </div>
  );
}
