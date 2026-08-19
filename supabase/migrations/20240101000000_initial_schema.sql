-- Profiles (Admin Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'superadmin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- set_updated_at helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles for each row execute procedure set_updated_at();

-- Tire Brands
create table tire_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger tire_brands_updated_at before update on tire_brands for each row execute procedure set_updated_at();

-- Tire Models
create table tire_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references tire_brands(id) on delete restrict,
  name text not null,
  slug text not null,
  description text,
  vehicle_type text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(brand_id, slug)
);
create trigger tire_models_updated_at before update on tire_models for each row execute procedure set_updated_at();
create index idx_tire_models_brand_id on tire_models(brand_id);

-- Tire Sizes
create table tire_sizes (
  id uuid primary key default gen_random_uuid(),
  width integer not null check (width > 0),
  profile integer not null check (profile > 0),
  rim integer not null check (rim > 0),
  created_at timestamptz default now(),
  unique(width, profile, rim)
);

-- Tire Variants (Products)
create table tire_variants (
  id uuid primary key default gen_random_uuid(),
  tire_model_id uuid not null references tire_models(id) on delete restrict,
  tire_size_id uuid not null references tire_sizes(id) on delete restrict,
  sku text not null unique,
  ean text unique,
  load_index text,
  speed_index text,
  run_flat boolean default false,
  reinforced boolean default false,
  efficiency text,
  wet_grip text,
  external_noise_db integer,
  inmetro_code text,
  warranty_months integer default 60,
  is_featured boolean default false,
  is_best_seller boolean default false,
  is_new boolean default false,
  free_shipping boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger tire_variants_updated_at before update on tire_variants for each row execute procedure set_updated_at();
create index idx_tire_variants_model_id on tire_variants(tire_model_id);
create index idx_tire_variants_size_id on tire_variants(tire_size_id);
create index idx_tire_variants_sku on tire_variants(sku);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger categories_updated_at before update on categories for each row execute procedure set_updated_at();
create index idx_categories_slug on categories(slug);

-- Product Categories (Junction)
create table product_categories (
  tire_variant_id uuid references tire_variants(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (tire_variant_id, category_id)
);

-- Product Images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  tire_variant_id uuid not null references tire_variants(id) on delete cascade,
  url text not null,
  alt_text text,
  position integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);
create index idx_product_images_variant_id on product_images(tire_variant_id);

-- Prices
create table prices (
  id uuid primary key default gen_random_uuid(),
  tire_variant_id uuid not null references tire_variants(id) on delete cascade,
  regular_price_cents integer not null check (regular_price_cents >= 0),
  sale_price_cents integer check (sale_price_cents >= 0),
  pix_price_cents integer check (pix_price_cents >= 0),
  currency text default 'BRL',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger prices_updated_at before update on prices for each row execute procedure set_updated_at();
create index idx_prices_variant_id on prices(tire_variant_id);

-- Inventory
create table inventory (
  id uuid primary key default gen_random_uuid(),
  tire_variant_id uuid not null unique references tire_variants(id) on delete restrict,
  quantity integer default 0 check (quantity >= 0),
  reserved_quantity integer default 0 check (reserved_quantity >= 0),
  low_stock_threshold integer default 5,
  updated_at timestamptz default now()
);
create trigger inventory_updated_at before update on inventory for each row execute procedure set_updated_at();
create index idx_inventory_variant_id on inventory(tire_variant_id);

-- Promotions
create table promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null,
  value numeric not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  check (ends_at >= starts_at)
);
create trigger promotions_updated_at before update on promotions for each row execute procedure set_updated_at();

-- Promotion Products
create table promotion_products (
  promotion_id uuid references promotions(id) on delete cascade,
  tire_variant_id uuid references tire_variants(id) on delete cascade,
  primary key (promotion_id, tire_variant_id)
);

-- Banners
create table banners (
  id uuid primary key default gen_random_uuid(),
  internal_name text not null,
  headline text,
  subheadline text,
  image_url text not null,
  cta_label text,
  cta_url text,
  position text not null,
  priority integer default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger banners_updated_at before update on banners for each row execute procedure set_updated_at();
create index idx_banners_position on banners(position);

-- Site Settings
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz default now()
);
create trigger site_settings_updated_at before update on site_settings for each row execute procedure set_updated_at();

-- is_admin helper function
create or replace function is_admin() returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;
