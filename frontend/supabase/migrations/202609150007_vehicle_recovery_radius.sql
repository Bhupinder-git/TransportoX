create or replace function public.find_nearest_available_vehicle(target_company uuid, target_lat numeric, target_lng numeric, radius_km numeric, target_weight_kg numeric)
returns table(vehicle_id uuid, distance_km numeric)
language sql security definer set search_path = public, extensions as $$
  select v.id,
    case when v.location is null then null
    else round((extensions.st_distance(v.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography) / 1000)::numeric, 3) end
  from public.vehicles v
  where v.company_id = target_company
    and v.status = 'AVAILABLE'
    and v.capacity_kg >= target_weight_kg
    and (v.location is null or extensions.st_dwithin(v.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography, radius_km * 1000))
  order by v.location is null,
    case when v.location is null then null else extensions.st_distance(v.location, extensions.st_setsrid(extensions.st_makepoint(target_lng, target_lat), 4326)::extensions.geography) end
  limit 1;
$$;
