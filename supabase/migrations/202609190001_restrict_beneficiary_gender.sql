begin;

update public.beneficiaries
set gender = null
where gender is not null
  and gender not in ('Niño', 'Niña');

alter table public.beneficiaries
  drop constraint if exists beneficiaries_gender_check;

alter table public.beneficiaries
  add constraint beneficiaries_gender_check
  check (gender is null or gender in ('Niño', 'Niña'));

commit;
