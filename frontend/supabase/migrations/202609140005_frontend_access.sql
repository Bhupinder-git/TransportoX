create policy "authenticated users read active companies" on public.companies
  for select to authenticated using (status = 'ACTIVE');

create policy "customers create request images" on public.delivery_images
  for insert to authenticated with check (exists (
    select 1 from public.delivery_requests r
    where r.id = request_id and r.customer_id = auth.uid()
  ));

create policy "company admins manage invoices" on public.invoices
  for all to authenticated using (exists (
    select 1 from public.delivery_requests r
    where r.id = request_id and public.is_company_admin(r.company_id)
  )) with check (exists (
    select 1 from public.delivery_requests r
    where r.id = request_id and public.is_company_admin(r.company_id)
  ));
