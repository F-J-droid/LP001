import fs from 'fs';
import crypto from 'crypto';

const uuid = () => crypto.randomUUID();

const dbRaw = fs.readFileSync('tirestore_admin_catalog_v1.json', 'utf8');
const db = JSON.parse(dbRaw);

let sql = `-- Seed generated from tirestore_admin_catalog_v1.json\n\n`;

// Clear existing data
sql += `-- Clear existing data\n`;
sql += `TRUNCATE TABLE site_settings CASCADE;\n`;
sql += `TRUNCATE TABLE banners CASCADE;\n`;
sql += `TRUNCATE TABLE promotion_products CASCADE;\n`;
sql += `TRUNCATE TABLE promotions CASCADE;\n`;
sql += `TRUNCATE TABLE inventory CASCADE;\n`;
sql += `TRUNCATE TABLE prices CASCADE;\n`;
sql += `TRUNCATE TABLE product_images CASCADE;\n`;
sql += `TRUNCATE TABLE product_categories CASCADE;\n`;
sql += `TRUNCATE TABLE categories CASCADE;\n`;
sql += `TRUNCATE TABLE tire_variants CASCADE;\n`;
sql += `TRUNCATE TABLE tire_sizes CASCADE;\n`;
sql += `TRUNCATE TABLE tire_models CASCADE;\n`;
sql += `TRUNCATE TABLE tire_brands CASCADE;\n\n`;

// 1. Brands
const brandMap = new Map(); // id -> uuid
sql += `-- Tire Brands\n`;
for (const b of db.brands) {
  const newId = uuid();
  brandMap.set(b.id || b.name, newId);
  sql += `INSERT INTO tire_brands (id, name, slug, is_active) VALUES ('${newId}', '${b.name.replace(/'/g, "''")}', '${b.slug}', ${b.isActive !== false});\n`;
}
sql += '\n';

// 2. Categories
const catMap = new Map();
sql += `-- Categories\n`;
for (const c of db.categories) {
  const newId = uuid();
  catMap.set(c.id || c.name, newId);
  sql += `INSERT INTO categories (id, name, slug, is_active) VALUES ('${newId}', '${c.name.replace(/'/g, "''")}', '${c.slug}', ${c.isActive !== false});\n`;
}
sql += '\n';

// 3. Models (derive from products)
const modelMap = new Map(); // brandId_modelName -> uuid
sql += `-- Tire Models\n`;
for (const p of db.products) {
  const key = `${p.brand}_${p.model}`;
  if (!modelMap.has(key)) {
    const brandId = brandMap.get(p.brand) || Array.from(brandMap.values())[0]; // fallback
    const newId = uuid();
    modelMap.set(key, newId);
    const slug = `${p.brand.toLowerCase()}-${p.model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    sql += `INSERT INTO tire_models (id, brand_id, name, slug, description, vehicle_type, is_active) VALUES ('${newId}', '${brandId}', '${p.model.replace(/'/g, "''")}', '${slug}', '${p.description?.replace(/'/g, "''") || ''}', '${p.vehicleType || ''}', true);\n`;
  }
}
sql += '\n';

// 4. Sizes
const sizeMap = new Map(); // width_profile_rim -> uuid
sql += `-- Tire Sizes\n`;
for (const p of db.products) {
  const key = `${p.width}_${p.profile}_${p.rim}`;
  if (!sizeMap.has(key)) {
    const newId = uuid();
    sizeMap.set(key, newId);
    sql += `INSERT INTO tire_sizes (id, width, profile, rim) VALUES ('${newId}', ${p.width}, ${p.profile}, ${p.rim});\n`;
  }
}
sql += '\n';

// 5. Variants & associations
sql += `-- Tire Variants, Prices, Inventory, Images\n`;
for (const p of db.products) {
  const modelKey = `${p.brand}_${p.model}`;
  const sizeKey = `${p.width}_${p.profile}_${p.rim}`;
  const modelId = modelMap.get(modelKey);
  const sizeId = sizeMap.get(sizeKey);
  const variantId = p.id && p.id.length === 36 ? p.id : uuid();

  const priceCents = Math.round(p.price * 100);
  const promoCents = p.promotionalPrice ? Math.round(p.promotionalPrice * 100) : 'NULL';
  const pixCents = p.pixPrice ? Math.round(p.pixPrice * 100) : 'NULL';

  const isFeatured = p.badges?.includes('Oferta') || false;
  const isBestSeller = p.badges?.includes('Mais vendido') || false;
  const isNew = p.badges?.includes('Lançamento') || false;

  const sku = p.sku || `SKU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const inmetroCode = p.inmetroCode || '';
  const eff = p.efficiency || '';
  const wet = p.wetGrip || '';
  const noise = p.externalNoiseDb || 'NULL';

  sql += `INSERT INTO tire_variants (id, tire_model_id, tire_size_id, sku, ean, load_index, speed_index, run_flat, reinforced, efficiency, wet_grip, external_noise_db, inmetro_code, is_featured, is_best_seller, is_new, free_shipping, is_active) VALUES ('${variantId}', '${modelId}', '${sizeId}', '${sku}', '${p.ean || ''}', '${p.loadIndex || ''}', '${p.speedIndex || ''}', ${p.runFlat || false}, ${p.reinforced || false}, '${eff}', '${wet}', ${noise}, '${inmetroCode}', ${isFeatured}, ${isBestSeller}, ${isNew}, ${p.freeShipping || false}, ${p.isActive !== false});\n`;

  // Product categories
  // Find category id matching vehicleType
  let catId = null;
  for (const c of db.categories) {
    if (c.name === p.vehicleType) {
      catId = catMap.get(c.id || c.name);
      break;
    }
  }
  if (catId) {
    sql += `INSERT INTO product_categories (tire_variant_id, category_id) VALUES ('${variantId}', '${catId}');\n`;
  }

  // Prices
  sql += `INSERT INTO prices (tire_variant_id, regular_price_cents, sale_price_cents, pix_price_cents) VALUES ('${variantId}', ${priceCents}, ${promoCents}, ${pixCents});\n`;

  // Inventory
  const inv = db.inventory?.find(i => i.productId === p.id);
  const qty = inv ? inv.available : p.stockQuantity || 10;
  sql += `INSERT INTO inventory (tire_variant_id, quantity) VALUES ('${variantId}', ${qty});\n`;

  // Images
  const gallery = p.gallery || [p.imageUrl];
  gallery.forEach((url, index) => {
    sql += `INSERT INTO product_images (tire_variant_id, url, position, is_primary) VALUES ('${variantId}', '${url}', ${index}, ${index === 0});\n`;
  });
}
sql += '\n';

// Banners
if (db.banners && db.banners.length > 0) {
  sql += `-- Banners\n`;
  for (const b of db.banners) {
    const newId = uuid();
    sql += `INSERT INTO banners (id, internal_name, headline, image_url, cta_label, cta_url, position, is_active) VALUES ('${newId}', '${b.name || 'Banner'}', '${b.title || ''}', '${b.desktopImage || ''}', '${b.linkText || ''}', '${b.linkUrl || ''}', 'home_hero', ${b.isActive !== false});\n`;
  }
}

fs.writeFileSync('supabase/seed.sql', sql);
console.log('Generated supabase/seed.sql');
