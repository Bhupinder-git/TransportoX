alter table public.companies add column if not exists rating numeric default 4.8;
alter table public.companies add column if not exists eta_label text default 'Quote after review';
alter table public.companies add column if not exists base_price_inr numeric default 15000;
alter table public.companies add column if not exists vehicle_types text default 'EV, Hybrid';
alter table public.companies add column if not exists capacity_label text default 'Up to 1,500 kg';
alter table public.companies add column if not exists insurance text default 'Included';
update public.companies set rating=4.9,eta_label='Today, 16:45',base_price_inr=15499,vehicle_types='EV, Hybrid',capacity_label='Up to 1,500 kg',insurance='Included' where name='Swiftline Transport';
update public.companies set rating=4.8,eta_label='Tomorrow, 09:15',base_price_inr=11750,vehicle_types='EV',capacity_label='Up to 1,200 kg',insurance='Optional' where name='Northstar Logistics';
