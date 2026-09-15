begin;

revoke delete on table public.beneficiaries from authenticated;

create or replace function public.can_read_beneficiary_media(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.beneficiary_images i
    join public.beneficiaries b on b.id = i.beneficiary_id
    where b.status = 'published'
      and (i.thumbnail_path = object_name or i.detail_path = object_name)
  );
$$;

revoke all on function public.can_read_beneficiary_media(text) from public;
grant execute on function public.can_read_beneficiary_media(text) to anon, authenticated;

drop policy if exists "published images can be read anonymously" on storage.objects;
create policy "published images can be read anonymously"
on storage.objects for select to anon
using (
  bucket_id = 'beneficiary-media'
  and public.can_read_beneficiary_media(name)
);

drop policy if exists "authenticated users read permitted images" on storage.objects;
create policy "authenticated users read permitted images"
on storage.objects for select to authenticated
using (
  bucket_id = 'beneficiary-media'
  and (
    public.is_admin()
    or public.can_read_beneficiary_media(name)
  )
);

commit;
