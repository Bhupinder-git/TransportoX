create extension if not exists pgcrypto;

create type public.app_role as enum ('CUSTOMER','COMPANY_ADMIN','DRIVER','PLATFORM_ADMIN');
create type public.request_status as enum ('PENDING_APPROVAL','VERIFIED','ACCEPTED','REJECTED','VEHICLE_ASSIGNED','IN_TRANSIT','DELIVERED','DELAYED','BREAKDOWN');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role public.app_role not null default 'CUSTOMER',
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  driver_id text,
  vehicle_id text,
  created_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  vehicle_number text not null,
  plate_number text not null,
  type text not null check (type in ('DIESEL','EV','HYBRID')),
  status text not null default 'AVAILABLE',
  capacity_kg numeric not null,
  current_load_kg numeric not null default 0,
  fuel_or_battery_pct numeric not null default 100,
  health_score numeric not null default 100,
  driver_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  driver_code text not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  status text not null default 'AVAILABLE',
  created_at timestamptz not null default now()
);

create table public.delivery_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete restrict,
  pickup text not null,
  dropoff text not null,
  payload_weight_kg numeric not null,
  length_cm numeric not null,
  width_cm numeric not null,
  height_cm numeric not null,
  notes text,
  status public.request_status not null default 'PENDING_APPROVAL',
  assigned_vehicle_id uuid references public.vehicles(id) on delete set null,
  assigned_driver_id uuid references public.profiles(id) on delete set null,
  quoted_price_inr numeric,
  eta timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_images (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.delivery_requests(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.delivery_requests(id) on delete cascade,
  driver_id uuid references public.profiles(id) on delete set null,
  company_id uuid not null references public.companies(id) on delete cascade,
  issue_type text not null,
  reason text,
  status text not null default 'AI_RECOVERY_STARTED',
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.delivery_requests(id) on delete cascade,
  invoice_number text not null unique,
  amount_inr numeric not null,
  status text not null default 'ISSUED',
  pdf_path text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.delivery_requests(id) on delete cascade,
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index notifications_request_title_unique on public.notifications(request_id,title);

create or replace function public.is_platform_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='PLATFORM_ADMIN') $$;
create or replace function public.is_company_admin(target_company uuid) returns boolean language sql stable security definer set search_path = public as $$ select public.is_platform_admin() or exists(select 1 from public.profiles where id=auth.uid() and role='COMPANY_ADMIN' and company_id=target_company) $$;
create or replace function public.is_company_driver(target_company uuid) returns boolean language sql stable security definer set search_path = public as $$ select public.is_platform_admin() or exists(select 1 from public.profiles where id=auth.uid() and role='DRIVER' and company_id=target_company) $$;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.delivery_requests enable row level security;
alter table public.delivery_images enable row level security;
alter table public.incidents enable row level security;
alter table public.invoices enable row level security;
alter table public.notifications enable row level security;

create policy "company admins read own company" on public.companies for select to authenticated using (public.is_company_admin(id));
create policy "profiles read self or company" on public.profiles for select to authenticated using (id=auth.uid() or public.is_company_admin(company_id));
create policy "company admins manage vehicles" on public.vehicles for all to authenticated using (public.is_company_admin(company_id)) with check (public.is_company_admin(company_id));
create policy "company admins manage drivers" on public.drivers for all to authenticated using (public.is_company_admin(company_id)) with check (public.is_company_admin(company_id));
create policy "customers create own requests" on public.delivery_requests for insert to authenticated with check (customer_id=auth.uid());
create policy "orders visible to participants" on public.delivery_requests for select to authenticated using (customer_id=auth.uid() or public.is_company_admin(company_id) or public.is_company_driver(company_id));
create policy "company admins update requests" on public.delivery_requests for update to authenticated using (public.is_company_admin(company_id)) with check (public.is_company_admin(company_id));
create policy "drivers update assigned requests" on public.delivery_requests for update to authenticated using (assigned_driver_id=auth.uid()) with check (assigned_driver_id=auth.uid());
create policy "request participants read images" on public.delivery_images for select to authenticated using (exists(select 1 from public.delivery_requests r where r.id=request_id and (r.customer_id=auth.uid() or public.is_company_admin(r.company_id) or public.is_company_driver(r.company_id))));
create policy "customers read own invoices" on public.invoices for select to authenticated using (exists(select 1 from public.delivery_requests r where r.id=request_id and r.customer_id=auth.uid()) or public.is_platform_admin());
create policy "company admins manage incidents" on public.incidents for all to authenticated using (public.is_company_admin(company_id)) with check (public.is_company_admin(company_id));
create policy "drivers create incidents" on public.incidents for insert to authenticated with check (driver_id=auth.uid());
create policy "users read own notifications" on public.notifications for select to authenticated using (user_id=auth.uid());

insert into storage.buckets (id,name,public) values ('delivery-images','delivery-images',false) on conflict (id) do nothing;
create policy "users upload own delivery images" on storage.objects for insert to authenticated with check (bucket_id='delivery-images' and (storage.foldername(name))[1]=(select auth.uid()::text));
create policy "users read own delivery images" on storage.objects for select to authenticated using (bucket_id='delivery-images' and (storage.foldername(name))[1]=(select auth.uid()::text));
