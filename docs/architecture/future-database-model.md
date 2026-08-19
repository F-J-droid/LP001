# Modelo de Banco de Dados Futuro (Supabase / PostgreSQL)

Para suportar todas as funcionalidades desenvolvidas nas Fases 1 a 6, o seguinte modelo relacional é recomendado.

## 1. Tabelas Principais

### `products`
* `id` (uuid, PK)
* `slug` (text, unique)
* `sku` (text, unique)
* `brand_id` (uuid, FK -> brands.id)
* `category_id` (uuid, FK -> categories.id)
* `model` (text)
* `description` (text)
* `width` (integer)
* `profile` (integer)
* `rim` (integer)
* `load_index` (text)
* `speed_index` (text)
* `run_flat` (boolean)
* `reinforced` (boolean)
* `price` (numeric)
* `promotional_price` (numeric, nullable)
* `pix_price` (numeric)
* `image_url` (text)
* `gallery` (text[])
* `inmetro_code` (text, nullable)
* `efficiency` (text, nullable)
* `wet_grip` (text, nullable)
* `external_noise_db` (integer, nullable)
* `is_active` (boolean, default true)
* `created_at` (timestamp)
* `updated_at` (timestamp)

### `inventory`
* `product_id` (uuid, PK, FK -> products.id)
* `available` (integer, default 0)
* `reserved` (integer, default 0)
* `status` (enum: 'in_stock', 'out_of_stock', 'pre_order')
* `updated_at` (timestamp)

### `brands`
* `id` (uuid, PK)
* `name` (text)
* `slug` (text, unique)
* `logo_url` (text, nullable)
* `is_active` (boolean, default true)

### `categories`
* `id` (uuid, PK)
* `name` (text)
* `slug` (text, unique)
* `description` (text, nullable)
* `is_active` (boolean, default true)

### `product_badges` (Muitos para Muitos)
* `product_id` (uuid, FK)
* `badge` (text - ex: 'Oferta', 'Lancamento')
* *Primary Key: (product_id, badge)*

### `vehicle_brands`
* `id` (uuid, PK)
* `name` (text)
* `slug` (text, unique)
* `is_active` (boolean)
* `created_at` (timestamp)

### `vehicle_models`
* `id` (uuid, PK)
* `brand_id` (uuid, FK -> vehicle_brands)
* `name` (text)
* `slug` (text, unique)
* `is_active` (boolean)
* `created_at` (timestamp)

### `vehicle_versions`
* `id` (uuid, PK)
* `model_id` (uuid, FK -> vehicle_models)
* `name` (text)
* `slug` (text, unique)
* `year_start` (int)
* `year_end` (int)
* `engine` (text, opcional)
* `trim` (text, opcional)
* `is_active` (boolean)

### `vehicle_fitments`
* `id` (uuid, PK)
* `vehicle_version_id` (uuid, FK -> vehicle_versions)
* `tire_size_id` (text, FK -> tire_sizes)
* `position` (enum: 'all', 'front', 'rear')

### `tire_sizes`
* `id` (text, PK, ex: '205-55-16')
* `width` (int)
* `profile` (int)
* `rim` (int)

## 2. Tabelas Comerciais (Checkout e Vendas)

### `orders`
* `id` (uuid, PK)
* `customer_id` (uuid, FK -> users.id)
* `status` (enum: 'pending', 'paid', 'shipped', 'delivered', 'cancelled')
* `payment_method` (text)
* `payment_status` (text)
* `subtotal` (numeric)
* `shipping_cost` (numeric)
* `total` (numeric)
* `shipping_address` (jsonb)
* `created_at` (timestamp)

### `order_items`
* `order_id` (uuid, FK -> orders.id)
* `product_id` (uuid, FK -> products.id)
* `quantity` (integer)
* `unit_price` (numeric)
* `total_price` (numeric)
* *Primary Key: (order_id, product_id)*

## 3. Configurações

### `site_settings`
Uma tabela simples de chave-valor ou única linha (Singleton).
* `id` (uuid, PK, limit 1 row)
* `config` (jsonb) -> Armazena as configurações gerais, textos, contatos e integrações.

## 4. Notas sobre a Migração
1. As imagens em `image_url` e `gallery` referenciarão URLs de buckets do Supabase Storage.
2. O sistema de autenticação utilizará o esquema `auth.users` nativo do Supabase.
3. Para garantir a performance, um gatilho (Trigger) deve atualizar o campo `stockStatus` em `products` toda vez que a tabela `inventory` sofrer uma alteração drástica (ex: estoque chegar a zero).
