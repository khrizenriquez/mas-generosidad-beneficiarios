begin;

create table public.beneficiary_localizations (
  beneficiary_id uuid not null references public.beneficiaries(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  school_grade text check (school_grade is null or char_length(school_grade) <= 180),
  favorite_subject text check (favorite_subject is null or char_length(favorite_subject) <= 180),
  hobby text check (hobby is null or char_length(hobby) <= 500),
  future_goal text check (future_goal is null or char_length(future_goal) <= 500),
  public_story text check (public_story is null or char_length(public_story) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (beneficiary_id, locale)
);

create table public.beneficiary_image_localizations (
  image_id uuid not null references public.beneficiary_images(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  alt_text text check (alt_text is null or char_length(alt_text) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (image_id, locale)
);

create index beneficiary_localizations_locale_idx
  on public.beneficiary_localizations (locale, beneficiary_id);
create index beneficiary_image_localizations_locale_idx
  on public.beneficiary_image_localizations (locale, image_id);

create or replace function public.set_localization_audit_fields()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger beneficiary_localizations_audit_fields
before update on public.beneficiary_localizations
for each row execute function public.set_localization_audit_fields();

create trigger beneficiary_image_localizations_audit_fields
before update on public.beneficiary_image_localizations
for each row execute function public.set_localization_audit_fields();

insert into public.beneficiary_localizations (
  beneficiary_id,
  locale,
  school_grade,
  favorite_subject,
  hobby,
  future_goal,
  public_story
)
select
  b.id,
  'es',
  b.school_grade,
  b.favorite_subject,
  b.hobby,
  b.future_goal,
  b.public_story
from public.beneficiaries b
on conflict (beneficiary_id, locale) do nothing;

insert into public.beneficiary_image_localizations (image_id, locale, alt_text)
select i.id, 'es', i.alt_text
from public.beneficiary_images i
where nullif(btrim(i.alt_text), '') is not null
on conflict (image_id, locale) do nothing;

create or replace function public.has_complete_beneficiary_localization(
  p_beneficiary_id uuid,
  p_locale text
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.beneficiary_localizations l
    where l.beneficiary_id = p_beneficiary_id
      and l.locale = p_locale
      and nullif(btrim(l.school_grade), '') is not null
      and nullif(btrim(l.favorite_subject), '') is not null
      and nullif(btrim(l.hobby), '') is not null
      and nullif(btrim(l.future_goal), '') is not null
      and nullif(btrim(l.public_story), '') is not null
  );
$$;

create or replace function public.has_any_beneficiary_localization_content(
  p_beneficiary_id uuid,
  p_locale text
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.beneficiary_localizations l
    where l.beneficiary_id = p_beneficiary_id
      and l.locale = p_locale
      and (
        nullif(btrim(l.school_grade), '') is not null
        or nullif(btrim(l.favorite_subject), '') is not null
        or nullif(btrim(l.hobby), '') is not null
        or nullif(btrim(l.future_goal), '') is not null
        or nullif(btrim(l.public_story), '') is not null
      )
  );
$$;

revoke all on function public.has_complete_beneficiary_localization(uuid, text) from public;
revoke all on function public.has_any_beneficiary_localization_content(uuid, text) from public;

create or replace function public.validate_beneficiary_status()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.date_of_birth is not null and new.date_of_birth > current_date then
    raise exception 'La fecha de nacimiento no puede estar en el futuro.';
  end if;

  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
    if new.date_of_birth is null
      or nullif(btrim(new.full_name), '') is null
      or not public.has_complete_beneficiary_localization(new.id, 'es')
      or (
        public.has_any_beneficiary_localization_content(new.id, 'en')
        and not public.has_complete_beneficiary_localization(new.id, 'en')
      )
    then
      raise exception 'Un perfil publicado requiere datos españoles completos; inglés debe estar completo si se inicia.';
    end if;
    new.published_at := now();
    new.archived_at := null;
  elsif new.status = 'archived' and (tg_op = 'INSERT' or old.status <> 'archived') then
    new.archived_at := now();
  elsif new.status = 'draft' then
    new.archived_at := null;
  end if;
  return new;
end;
$$;

alter table public.beneficiary_localizations enable row level security;
alter table public.beneficiary_image_localizations enable row level security;

create policy "admins read beneficiary localizations"
on public.beneficiary_localizations for select to authenticated
using (public.is_admin());
create policy "admins create beneficiary localizations"
on public.beneficiary_localizations for insert to authenticated
with check (public.is_admin());
create policy "admins update beneficiary localizations"
on public.beneficiary_localizations for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins delete beneficiary localizations"
on public.beneficiary_localizations for delete to authenticated
using (public.is_admin());

create policy "admins read image localizations"
on public.beneficiary_image_localizations for select to authenticated
using (public.is_admin());
create policy "admins create image localizations"
on public.beneficiary_image_localizations for insert to authenticated
with check (public.is_admin());
create policy "admins update image localizations"
on public.beneficiary_image_localizations for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins delete image localizations"
on public.beneficiary_image_localizations for delete to authenticated
using (public.is_admin());

revoke all on public.beneficiary_localizations, public.beneficiary_image_localizations from anon;
grant select, insert, update, delete on public.beneficiary_localizations to authenticated;
grant select, insert, update, delete on public.beneficiary_image_localizations to authenticated;

drop function public.get_public_beneficiary(text);
drop function public.get_public_beneficiaries();

create function public.get_public_beneficiaries()
returns table (
  id uuid,
  code text,
  full_name text,
  age integer,
  gender text,
  localizations jsonb,
  images jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    b.id,
    b.code,
    b.full_name,
    extract(year from age(current_date, b.date_of_birth))::integer as age,
    b.gender,
    coalesce((
      select jsonb_object_agg(
        l.locale,
        jsonb_build_object(
          'school_grade', l.school_grade,
          'favorite_subject', l.favorite_subject,
          'hobby', l.hobby,
          'future_goal', l.future_goal,
          'public_story', l.public_story
        )
      )
      from public.beneficiary_localizations l
      where l.beneficiary_id = b.id
        and public.has_complete_beneficiary_localization(l.beneficiary_id, l.locale)
    ), '{}'::jsonb) as localizations,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'thumbnail_path', i.thumbnail_path,
          'detail_path', i.detail_path,
          'alt_texts', coalesce((
            select jsonb_object_agg(il.locale, il.alt_text)
            from public.beneficiary_image_localizations il
            where il.image_id = i.id
              and nullif(btrim(il.alt_text), '') is not null
          ), '{}'::jsonb),
          'sort_order', i.sort_order,
          'is_primary', i.is_primary
        ) order by i.sort_order
      )
      from public.beneficiary_images i
      where i.beneficiary_id = b.id
    ), '[]'::jsonb) as images
  from public.beneficiaries b
  where b.status = 'published'
  order by b.full_name;
$$;

create function public.get_public_beneficiary(p_code text)
returns table (
  id uuid,
  code text,
  full_name text,
  age integer,
  gender text,
  localizations jsonb,
  images jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.* from public.get_public_beneficiaries() p where p.code = p_code limit 1;
$$;

revoke all on function public.get_public_beneficiaries() from public;
revoke all on function public.get_public_beneficiary(text) from public;
grant execute on function public.get_public_beneficiaries() to anon, authenticated;
grant execute on function public.get_public_beneficiary(text) to anon, authenticated;

commit;
