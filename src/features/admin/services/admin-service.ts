'use server';

import { createClient } from '@/lib/supabase/server';
import { TireProduct } from '@/features/products/types';
import { revalidatePath } from 'next/cache';
import { productRepository } from '@/features/products/repositories/supabase-product-repository';

export async function getAdminProducts(): Promise<TireProduct[]> {
  const result = await productRepository.getAllProducts(1, 1000);
  return result.data;
}

export async function createAdminProduct(product: TireProduct): Promise<void> {
  const supabase = await createClient();

  // Ensure Brand exists
  let { data: brand } = await supabase.from('tire_brands').select('id').ilike('name', product.brand).single();
  if (!brand) {
    const { data: newBrand, error } = await supabase.from('tire_brands').insert({
      name: product.brand,
      slug: product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }).select('id').single();
    if (error) throw new Error('Erro ao criar marca: ' + error.message);
    brand = newBrand;
  }

  // Ensure Model exists
  let { data: model } = await supabase.from('tire_models').select('id').eq('brand_id', brand.id).ilike('name', product.model).single();
  if (!model) {
    const { data: newModel, error } = await supabase.from('tire_models').insert({
      brand_id: brand.id,
      name: product.model,
      slug: `${product.brand.toLowerCase()}-${product.model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      vehicle_type: product.vehicleType,
      description: product.description,
    }).select('id').single();
    if (error) throw new Error('Erro ao criar modelo: ' + error.message);
    model = newModel;
  }

  // Ensure Size exists
  let { data: size } = await supabase.from('tire_sizes').select('id')
    .eq('width', product.width).eq('profile', product.profile).eq('rim', product.rim).single();
  if (!size) {
    const { data: newSize, error } = await supabase.from('tire_sizes').insert({
      width: product.width,
      profile: product.profile,
      rim: product.rim,
    }).select('id').single();
    if (error) throw new Error('Erro ao criar medida: ' + error.message);
    size = newSize;
  }

  // Create Variant
  const { data: variant, error: varError } = await supabase.from('tire_variants').insert({
    id: product.id,
    tire_model_id: model.id,
    tire_size_id: size.id,
    sku: product.sku,
    ean: product.ean || null,
    load_index: product.loadIndex,
    speed_index: product.speedIndex,
    run_flat: product.runFlat,
    reinforced: product.reinforced,
    efficiency: product.efficiency,
    wet_grip: product.wetGrip,
    external_noise_db: product.externalNoiseDb,
    inmetro_code: product.inmetroCode,
    is_featured: product.badges?.includes('Oferta') || false,
    is_best_seller: product.badges?.includes('Mais vendido') || false,
    is_new: product.badges?.includes('Lançamento') || false,
    is_active: product.isActive !== false,
  }).select('id').single();
  
  if (varError) throw new Error('Erro ao criar variante: ' + varError.message);

  // Categories
  if (product.vehicleType) {
    const { data: cat } = await supabase.from('categories').select('id').ilike('name', product.vehicleType).single();
    if (cat) {
      await supabase.from('product_categories').insert({
        tire_variant_id: variant.id,
        category_id: cat.id
      });
    }
  }

  // Prices
  await supabase.from('prices').insert({
    tire_variant_id: variant.id,
    regular_price_cents: Math.round(product.price * 100),
    sale_price_cents: product.promotionalPrice ? Math.round(product.promotionalPrice * 100) : null,
    pix_price_cents: product.pixPrice ? Math.round(product.pixPrice * 100) : null,
  });

  // Images
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];
  for (let i = 0; i < images.length; i++) {
    await supabase.from('product_images').insert({
      tire_variant_id: variant.id,
      url: images[i],
      position: i,
      is_primary: i === 0
    });
  }

  revalidatePath('/pneus');
  revalidatePath('/admin/produtos');
}

export async function updateAdminProduct(id: string, updates: Partial<TireProduct>): Promise<void> {
  const supabase = await createClient();

  // This is a partial update. We map the domains fields to DB fields.
  const varUpdates: Record<string, unknown> = {};
  if (updates.sku !== undefined) varUpdates.sku = updates.sku;
  if (updates.ean !== undefined) varUpdates.ean = updates.ean || null;
  if (updates.loadIndex !== undefined) varUpdates.load_index = updates.loadIndex;
  if (updates.speedIndex !== undefined) varUpdates.speed_index = updates.speedIndex;
  if (updates.runFlat !== undefined) varUpdates.run_flat = updates.runFlat;
  if (updates.reinforced !== undefined) varUpdates.reinforced = updates.reinforced;
  if (updates.efficiency !== undefined) varUpdates.efficiency = updates.efficiency;
  if (updates.wetGrip !== undefined) varUpdates.wet_grip = updates.wetGrip;
  if (updates.externalNoiseDb !== undefined) varUpdates.external_noise_db = updates.externalNoiseDb;
  if (updates.inmetroCode !== undefined) varUpdates.inmetro_code = updates.inmetroCode;
  if (updates.isActive !== undefined) varUpdates.is_active = updates.isActive;
  
  if (updates.badges) {
    varUpdates.is_featured = updates.badges.includes('Oferta');
    varUpdates.is_best_seller = updates.badges.includes('Mais vendido');
    varUpdates.is_new = updates.badges.includes('Lançamento');
  }

  if (Object.keys(varUpdates).length > 0) {
    const { error } = await supabase.from('tire_variants').update(varUpdates).eq('id', id);
    if (error) throw new Error('Erro ao atualizar variante: ' + error.message);
  }

  // Update Prices if provided
  if (updates.price !== undefined || updates.promotionalPrice !== undefined || updates.pixPrice !== undefined) {
    const { data: priceData } = await supabase.from('prices').select('*').eq('tire_variant_id', id).single();
    
    const priceUpdates: Record<string, unknown> = {};
    if (updates.price !== undefined) priceUpdates.regular_price_cents = Math.round(updates.price * 100);
    if (updates.promotionalPrice !== undefined) priceUpdates.sale_price_cents = Math.round(updates.promotionalPrice * 100);
    if (updates.pixPrice !== undefined) priceUpdates.pix_price_cents = Math.round(updates.pixPrice * 100);
    
    if (priceData) {
      await supabase.from('prices').update(priceUpdates).eq('id', priceData.id);
    } else {
      await supabase.from('prices').insert({
        tire_variant_id: id,
        ...priceUpdates
      });
    }
  }

  // Update Images
  if (updates.imageUrl || updates.gallery) {
    await supabase.from('product_images').delete().eq('tire_variant_id', id);
    const images = updates.gallery && updates.gallery.length > 0 ? updates.gallery : (updates.imageUrl ? [updates.imageUrl] : []);
    for (let i = 0; i < images.length; i++) {
      await supabase.from('product_images').insert({
        tire_variant_id: id,
        url: images[i],
        position: i,
        is_primary: i === 0
      });
    }
  }

  // Ensure revalidation clears cache
  revalidatePath('/pneus');
  revalidatePath(`/produto/${updates.slug || id}`);
  revalidatePath('/admin/produtos');
}

export async function archiveAdminProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('tire_variants').update({ is_active: false }).eq('id', id);
  if (error) throw new Error('Erro ao arquivar produto: ' + error.message);
  
  revalidatePath('/pneus');
  revalidatePath('/admin/produtos');
}

// Quick Inventory
export async function updateInventory(productId: string, available: number): Promise<void> {
  const supabase = await createClient();
  
  const { data: invData } = await supabase.from('inventory').select('*').eq('tire_variant_id', productId).single();
  
  if (invData) {
    const { error } = await supabase.from('inventory').update({ quantity: available }).eq('id', invData.id);
    if (error) throw new Error('Erro ao atualizar estoque: ' + error.message);
  } else {
    const { error } = await supabase.from('inventory').insert({
      tire_variant_id: productId,
      quantity: available,
    });
    if (error) throw new Error('Erro ao criar estoque: ' + error.message);
  }

  revalidatePath('/pneus');
  revalidatePath('/admin/estoque');
}

export async function resetDevelopmentData(): Promise<void> {
  throw new Error("Resetting data is disabled when using Supabase in this environment.");
}
