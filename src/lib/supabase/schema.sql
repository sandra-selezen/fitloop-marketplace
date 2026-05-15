-- =========================================================
-- Profiles
-- =========================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  location text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Policies

-- User can read their own profile
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- User can update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- User can insert their own profile
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- 4. updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- 5. Auto-create profile after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================================================
-- Products
-- =========================================================

-- 1. Product enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_type') then
    create type public.product_type as enum ('new', 'pre_owned');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_condition') then
    create type public.product_condition as enum (
      'new_with_tags',
      'new_without_tags',
      'like_new',
      'good',
      'fair'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'product_category') then
    create type public.product_category as enum (
      'clothing',
      'shoes',
      'accessories',
      'running',
      'training',
      'yoga',
      'outdoor',
      'cycling'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'product_gender') then
    create type public.product_gender as enum ('women', 'men', 'unisex');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type public.product_status as enum ('draft', 'active', 'sold', 'archived');
  end if;
end $$;

-- 2. Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,

  title text not null,
  slug text not null unique,
  description text not null,

  category public.product_category not null,
  brand text not null,
  product_type public.product_type not null,
  condition public.product_condition not null,
  size text not null,
  color text not null,
  gender public.product_gender not null,

  price numeric(10, 2) not null check (price > 0),
  location text not null,

  status public.product_status not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Product images table
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  path text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Indexes
create index if not exists products_seller_id_idx on public.products(seller_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_created_at_idx on public.products(created_at desc);
create index if not exists product_images_product_id_idx on public.product_images(product_id);

-- 5. Enable RLS
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- 6. Products policies

create policy "Anyone can view active products"
on public.products
for select
to anon, authenticated
using (status = 'active');

create policy "Users can view their own products"
on public.products
for select
to authenticated
using (auth.uid() = seller_id);

create policy "Users can create their own products"
on public.products
for insert
to authenticated
with check (auth.uid() = seller_id);

create policy "Users can update their own products"
on public.products
for update
to authenticated
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

create policy "Users can delete their own products"
on public.products
for delete
to authenticated
using (auth.uid() = seller_id);

-- 7. Product images policies

create policy "Anyone can view active product images"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.status = 'active'
  )
);

create policy "Users can view images for their own products"
on public.product_images
for select
to authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.seller_id = auth.uid()
  )
);

create policy "Users can create images for their own products"
on public.product_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.seller_id = auth.uid()
  )
);

create policy "Users can delete images for their own products"
on public.product_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.seller_id = auth.uid()
  )
);

-- 8. updated_at trigger for products
drop trigger if exists products_updated_at on public.products;

create trigger products_updated_at
before update on public.products
for each row
execute function public.handle_updated_at();

-- =========================================================
-- Storage
-- =========================================================

-- Allow anyone to read product images
create policy "Anyone can view product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
create policy "Authenticated users can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

-- Allow authenticated users to update their own product images
create policy "Authenticated users can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and owner = auth.uid())
with check (bucket_id = 'product-images' and owner = auth.uid());

-- Allow authenticated users to delete their own product images
create policy "Authenticated users can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and owner = auth.uid());

-- =========================================================
-- Orders
-- =========================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum (
      'pending',
      'paid',
      'shipped',
      'completed',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum (
      'pending',
      'demo_paid',
      'paid',
      'failed',
      'refunded'
    );
  end if;
end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  buyer_id uuid not null references public.profiles(id) on delete cascade,

  customer_email text not null,
  customer_phone text not null,

  first_name text not null,
  last_name text not null,
  country text not null,
  city text not null,
  address text not null,
  postal_code text not null,

  delivery_method text not null,
  shipping_amount numeric(10, 2) not null default 0,
  subtotal_amount numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) not null default 0,

  status public.order_status not null default 'paid',
  payment_status public.payment_status not null default 'demo_paid',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,

  product_title text not null,
  product_brand text not null,
  product_image text,
  product_size text,
  product_condition text,

  unit_price numeric(10, 2) not null,
  quantity integer not null default 1 check (quantity > 0),
  total_price numeric(10, 2) not null,

  created_at timestamptz not null default now()
);

create index if not exists orders_buyer_id_idx on public.orders(buyer_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);
create index if not exists order_items_seller_id_idx on public.order_items(seller_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Buyers can view their own orders
create policy "Users can view their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = buyer_id);

-- Buyers can create their own orders
create policy "Users can create their own orders"
on public.orders
for insert
to authenticated
with check (auth.uid() = buyer_id);

-- Buyers can view items from their own orders
create policy "Users can view their own order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.buyer_id = auth.uid()
  )
);

-- Sellers can view order items for products they sold
create policy "Sellers can view their sold order items"
on public.order_items
for select
to authenticated
using (seller_id = auth.uid());

-- Buyers can create items for their own orders
create policy "Users can create items for their own orders"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.buyer_id = auth.uid()
  )
);

drop trigger if exists orders_updated_at on public.orders;

create trigger orders_updated_at
before update on public.orders
for each row
execute function public.handle_updated_at();
