alter table public.vehicles add column if not exists current_lat numeric;
alter table public.vehicles add column if not exists current_lng numeric;
alter table public.vehicles add column if not exists location extensions.geography(Point, 4326);
create index if not exists vehicles_location_gist_idx on public.vehicles using gist (location);

create or replace function public.sync_vehicle_location()
returns trigger language plpgsql as $$
begin
  if new.current_lat is null or new.current_lng is null then new.location = null;
  else new.location = extensions.st_setsrid(extensions.st_makepoint(new.current_lng, new.current_lat), 4326)::extensions.geography;
  end if;
  return new;
end;
$$;
drop trigger if exists vehicles_location_sync on public.vehicles;
create trigger vehicles_location_sync before insert or update on public.vehicles
for each row execute function public.sync_vehicle_location();

create table if not exists public.vehicle_recovery_requests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.delivery_requests(id) on delete cascade,
  incident_id uuid references public.incidents(id) on delete set null,
  company_id uuid not null references public.companies(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  status text not null default 'REQUESTED',
  eta_minutes integer,
  ai_reason text,
  created_at timestamptz not null default now()
);
alter table public.vehicle_recovery_requests enable row level security;
create policy "recovery participants read" on public.vehicle_recovery_requests for select to authenticated using (public.is_company_admin(company_id) or exists(select 1 from public.delivery_requests r where r.id=request_id and r.customer_id=auth.uid()));

create or replace function public.find_nearest_available_vehicle(target_company uuid, target_lat numeric, target_lng numeric, radius_km numeric, target_weight_kg numeric)
returns table(vehicle_id uuid, distance_km numeric)
language sql security definer set search_path = public, extensions as $$
  select v.id, case when v.location is null then null else round((extensions.st_distance(v.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography) / 1000)::numeric, 3) end
  from public.vehicles v
  where v.company_id = target_company and v.status = 'AVAILABLE' and v.capacity_kg >= target_weight_kg
  order by v.location is null, case when v.location is null then null else extensions.st_distance(v.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography) end
  limit 1;
$$;
