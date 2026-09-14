create schema if not exists extensions;
create extension if not exists postgis with schema extensions;

alter type public.request_status add value if not exists 'PLACED';
alter type public.request_status add value if not exists 'PICKED_UP';
alter type public.request_status add value if not exists 'CANCELLED';

alter table public.delivery_requests
  add column if not exists pickup_lat numeric,
  add column if not exists pickup_lng numeric,
  add column if not exists dropoff_lat numeric,
  add column if not exists dropoff_lng numeric,
  add column if not exists cargo_type text,
  add column if not exists cargo_dimensions jsonb not null default '{}'::jsonb;

alter table public.drivers
  add column if not exists current_lat numeric,
  add column if not exists current_lng numeric,
  add column if not exists location extensions.geography(Point, 4326),
  add column if not exists available boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists drivers_location_gist_idx on public.drivers using gist (location);

create or replace function public.sync_driver_location()
returns trigger language plpgsql as $$
begin
  if new.current_lat is null or new.current_lng is null then new.location = null;
  else new.location = extensions.st_setsrid(extensions.st_makepoint(new.current_lng, new.current_lat), 4326)::extensions.geography;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists drivers_location_sync on public.drivers;
create trigger drivers_location_sync before insert or update on public.drivers
for each row execute function public.sync_driver_location();

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.delivery_requests(id) on delete cascade,
  status text not null,
  changed_at timestamptz not null default now()
);
create index if not exists order_status_history_request_idx on public.order_status_history(request_id, changed_at desc);

create or replace function public.find_nearest_available_driver(target_lat numeric, target_lng numeric, radius_km numeric)
returns table(driver_id uuid, profile_id uuid, distance_km numeric)
language sql security definer set search_path = public, extensions as $$
  select d.id, d.profile_id, round((extensions.st_distance(d.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography) / 1000)::numeric, 3)
  from public.drivers d
  where d.available = true and d.location is not null
    and extensions.st_dwithin(d.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography, radius_km * 1000)
  order by extensions.st_distance(d.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography)
  limit 1;
$$;
