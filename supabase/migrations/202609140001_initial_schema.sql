begin;

create extension if not exists pgcrypto with schema extensions;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.beneficiaries (
  id uuid primary key default extensions.gen_random_uuid(),
  code text not null unique check (code ~ '^MG-[0-9]{3}$'),
  full_name text check (full_name is null or char_length(full_name) <= 180),
  date_of_birth date,
  gender text check (gender is null or char_length(gender) <= 80),
  school_grade text check (school_grade is null or char_length(school_grade) <= 180),
  favorite_subject text check (favorite_subject is null or char_length(favorite_subject) <= 180),
  hobby text check (hobby is null or char_length(hobby) <= 500),
  future_goal text check (future_goal is null or char_length(future_goal) <= 500),
  public_story text check (public_story is null or char_length(public_story) <= 5000),
  import_notes text check (import_notes is null or char_length(import_notes) <= 5000),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.beneficiary_images (
  id uuid primary key default extensions.gen_random_uuid(),
  beneficiary_id uuid not null references public.beneficiaries(id) on delete cascade,
  thumbnail_path text not null unique,
  detail_path text not null unique,
  alt_text text check (alt_text is null or char_length(alt_text) <= 300),
  sort_order integer not null check (sort_order between 0 and 2),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (beneficiary_id, sort_order)
);

create index beneficiaries_status_name_idx on public.beneficiaries (status, full_name);
create index beneficiaries_created_by_idx on public.beneficiaries (created_by);
create index beneficiaries_updated_by_idx on public.beneficiaries (updated_by);
create index beneficiary_images_beneficiary_idx on public.beneficiary_images (beneficiary_id);
create unique index beneficiary_images_one_primary_idx
  on public.beneficiary_images (beneficiary_id)
  where is_primary;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$ select public.is_admin(); $$;

revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

create or replace function public.set_beneficiary_audit_fields()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
  end if;
  new.updated_by := coalesce(auth.uid(), new.updated_by);
  new.updated_at := now();
  return new;
end;
$$;

create trigger beneficiaries_audit_fields
before insert or update on public.beneficiaries
for each row execute function public.set_beneficiary_audit_fields();

create or replace function public.validate_beneficiary_status()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.date_of_birth is not null and new.date_of_birth > current_date then
    raise exception 'La fecha de nacimiento no puede estar en el futuro.';
  end if;

  if new.status = 'published' and (
    new.date_of_birth is null
    or nullif(btrim(new.full_name), '') is null
    or nullif(btrim(new.school_grade), '') is null
    or nullif(btrim(new.favorite_subject), '') is null
    or nullif(btrim(new.hobby), '') is null
    or nullif(btrim(new.future_goal), '') is null
    or nullif(btrim(new.public_story), '') is null
  ) then
    raise exception 'Un perfil publicado requiere fecha de nacimiento y todos los campos públicos principales.';
  end if;

  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
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

create trigger beneficiaries_validate_status
before insert or update on public.beneficiaries
for each row execute function public.validate_beneficiary_status();

create or replace function public.limit_beneficiary_images()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if (select count(*) from public.beneficiary_images where beneficiary_id = new.beneficiary_id) >= 3 then
    raise exception 'Cada beneficiario puede tener como máximo tres imágenes.';
  end if;
  return new;
end;
$$;

create trigger beneficiary_images_limit
before insert on public.beneficiary_images
for each row execute function public.limit_beneficiary_images();

create or replace function public.get_next_beneficiary_code()
returns text
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  next_number integer;
begin
  if not public.is_admin() then
    raise exception 'Acceso no autorizado.' using errcode = '42501';
  end if;
  select coalesce(max(substring(code from 4)::integer), 0) + 1
    into next_number
    from public.beneficiaries;
  return 'MG-' || lpad(next_number::text, 3, '0');
end;
$$;

revoke all on function public.get_next_beneficiary_code() from public;
grant execute on function public.get_next_beneficiary_code() to authenticated;

create or replace function public.get_public_beneficiaries()
returns table (
  id uuid,
  code text,
  full_name text,
  age integer,
  gender text,
  school_grade text,
  favorite_subject text,
  hobby text,
  future_goal text,
  public_story text,
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
    b.school_grade,
    b.favorite_subject,
    b.hobby,
    b.future_goal,
    b.public_story,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'thumbnail_path', i.thumbnail_path,
          'detail_path', i.detail_path,
          'alt_text', i.alt_text,
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

create or replace function public.get_public_beneficiary(p_code text)
returns table (
  id uuid,
  code text,
  full_name text,
  age integer,
  gender text,
  school_grade text,
  favorite_subject text,
  hobby text,
  future_goal text,
  public_story text,
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

alter table public.admin_users enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.beneficiary_images enable row level security;

create policy "admins read allowlist"
on public.admin_users for select to authenticated
using (public.is_admin());

create policy "admins read beneficiaries"
on public.beneficiaries for select to authenticated
using (public.is_admin());

create policy "admins create beneficiaries"
on public.beneficiaries for insert to authenticated
with check (public.is_admin());

create policy "admins update beneficiaries"
on public.beneficiaries for update to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "admins read images"
on public.beneficiary_images for select to authenticated
using (public.is_admin());

create policy "admins create images"
on public.beneficiary_images for insert to authenticated
with check (public.is_admin());

create policy "admins update images"
on public.beneficiary_images for update to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "admins delete images"
on public.beneficiary_images for delete to authenticated
using (public.is_admin());

revoke all on public.admin_users, public.beneficiaries, public.beneficiary_images from anon;
grant select on public.admin_users to authenticated;
grant select, insert, update on public.beneficiaries to authenticated;
grant select, insert, update, delete on public.beneficiary_images to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'beneficiary-media',
  'beneficiary-media',
  false,
  10485760,
  array['image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "published images can be read anonymously"
on storage.objects for select to anon
using (
  bucket_id = 'beneficiary-media'
  and exists (
    select 1
    from public.beneficiary_images i
    join public.beneficiaries b on b.id = i.beneficiary_id
    where b.status = 'published'
      and (i.thumbnail_path = name or i.detail_path = name)
  )
);

create policy "authenticated users read permitted images"
on storage.objects for select to authenticated
using (
  bucket_id = 'beneficiary-media'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.beneficiary_images i
      join public.beneficiaries b on b.id = i.beneficiary_id
      where b.status = 'published'
        and (i.thumbnail_path = name or i.detail_path = name)
    )
  )
);

create policy "admins upload images"
on storage.objects for insert to authenticated
with check (bucket_id = 'beneficiary-media' and public.is_admin());

create policy "admins update images"
on storage.objects for update to authenticated
using (bucket_id = 'beneficiary-media' and public.is_admin())
with check (bucket_id = 'beneficiary-media' and public.is_admin());

create policy "admins delete images"
on storage.objects for delete to authenticated
using (bucket_id = 'beneficiary-media' and public.is_admin());

commit;
