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
