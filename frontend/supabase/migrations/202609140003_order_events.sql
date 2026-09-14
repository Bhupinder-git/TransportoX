create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.delivery_requests(id) on delete cascade,
  event_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.order_events enable row level security;
create policy "participants read order events" on public.order_events for select to authenticated using (exists(select 1 from public.delivery_requests r where r.id=request_id and (r.customer_id=auth.uid() or public.is_company_admin(r.company_id) or public.is_company_driver(r.company_id))));
