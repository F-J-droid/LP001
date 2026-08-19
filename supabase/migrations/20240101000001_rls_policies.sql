-- Enable RLS on all tables
alter table profiles enable row level security;
alter table tire_brands enable row level security;
alter table tire_models enable row level security;
alter table tire_sizes enable row level security;
alter table tire_variants enable row level security;
alter table categories enable row level security;
alter table product_categories enable row level security;
alter table product_images enable row level security;
alter table prices enable row level security;
alter table inventory enable row level security;
alter table promotions enable row level security;
alter table promotion_products enable row level security;
alter table banners enable row level security;
alter table site_settings enable row level security;

-- PROFILES
create policy "Users can read own profile" on profiles for select to authenticated using (auth.uid() = id);
create policy "Admins can read all profiles" on profiles for select to authenticated using (is_admin());

-- TIRE BRANDS
create policy "Public read active brands" on tire_brands for select using (is_active = true);
create policy "Admin all brands" on tire_brands for all to authenticated using (is_admin());

-- TIRE MODELS
create policy "Public read active models" on tire_models for select using (is_active = true);
create policy "Admin all models" on tire_models for all to authenticated using (is_admin());

-- TIRE SIZES
create policy "Public read sizes" on tire_sizes for select using (true);
create policy "Admin all sizes" on tire_sizes for all to authenticated using (is_admin());

-- TIRE VARIANTS
create policy "Public read active variants" on tire_variants for select using (is_active = true);
create policy "Admin all variants" on tire_variants for all to authenticated using (is_admin());

-- CATEGORIES
create policy "Public read active categories" on categories for select using (is_active = true);
create policy "Admin all categories" on categories for all to authenticated using (is_admin());

-- PRODUCT CATEGORIES
create policy "Public read product categories" on product_categories for select using (true);
create policy "Admin all product categories" on product_categories for all to authenticated using (is_admin());

-- PRODUCT IMAGES
create policy "Public read product images" on product_images for select using (true);
create policy "Admin all product images" on product_images for all to authenticated using (is_admin());

-- PRICES
create policy "Public read active prices" on prices for select using (is_active = true);
create policy "Admin all prices" on prices for all to authenticated using (is_admin());

-- INVENTORY
create policy "Public read inventory" on inventory for select using (true);
create policy "Admin all inventory" on inventory for all to authenticated using (is_admin());

-- PROMOTIONS
create policy "Public read active promotions" on promotions for select using (is_active = true);
create policy "Admin all promotions" on promotions for all to authenticated using (is_admin());

-- PROMOTION PRODUCTS
create policy "Public read promotion products" on promotion_products for select using (true);
create policy "Admin all promotion products" on promotion_products for all to authenticated using (is_admin());

-- BANNERS
create policy "Public read active banners" on banners for select using (is_active = true);
create policy "Admin all banners" on banners for all to authenticated using (is_admin());

-- SITE SETTINGS
create policy "Public read site settings" on site_settings for select using (true);
create policy "Admin all site settings" on site_settings for all to authenticated using (is_admin());
