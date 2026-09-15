begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(18);

select has_table('public', 'beneficiaries', 'Existe beneficiaries');
select has_table('public', 'beneficiary_images', 'Existe beneficiary_images');
select has_table('public', 'admin_users', 'Existe admin_users');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.beneficiaries'::regclass),
  'RLS está habilitado en beneficiaries'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.beneficiary_images'::regclass),
  'RLS está habilitado en beneficiary_images'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.admin_users'::regclass),
  'RLS está habilitado en admin_users'
);

select policies_are(
  'public',
  'beneficiaries',
  array[
    'admins create beneficiaries',
    'admins read beneficiaries',
    'admins update beneficiaries'
  ],
  'Beneficiaries no expone política pública ni borrado'
);

select ok(
  not has_table_privilege('anon', 'public.beneficiaries', 'SELECT'),
  'Anon no tiene SELECT directo en beneficiaries'
);
select ok(
  not has_table_privilege('anon', 'public.beneficiary_images', 'SELECT'),
  'Anon no tiene SELECT directo en beneficiary_images'
);
select ok(
  not has_table_privilege('anon', 'public.admin_users', 'SELECT'),
  'Anon no tiene SELECT directo en admin_users'
);
select ok(
  not has_table_privilege('authenticated', 'public.beneficiaries', 'DELETE'),
  'Authenticated no tiene DELETE en beneficiaries'
);

select has_function(
  'public',
  'get_public_beneficiaries',
  array[]::text[],
  'Existe la colección pública segura'
);
select has_function(
  'public',
  'get_public_beneficiary',
  array['text'],
  'Existe el detalle público seguro'
);

select results_eq(
  $$select unnest(proallargnames)::text
    from pg_proc
    where oid = 'public.get_public_beneficiaries()'::regprocedure$$,
  $$values
    ('id'::text),
    ('code'::text),
    ('full_name'::text),
    ('age'::text),
    ('gender'::text),
    ('school_grade'::text),
    ('favorite_subject'::text),
    ('hobby'::text),
    ('future_goal'::text),
    ('public_story'::text),
    ('images'::text)$$,
  'La RPC pública expone exactamente las columnas aprobadas'
);

select ok(
  has_function_privilege('anon', 'public.get_public_beneficiaries()', 'EXECUTE'),
  'Anon puede ejecutar la colección pública'
);
select ok(
  has_function_privilege('anon', 'public.get_public_beneficiary(text)', 'EXECUTE'),
  'Anon puede ejecutar el detalle público'
);

select has_trigger(
  'public',
  'beneficiary_images',
  'beneficiary_images_limit',
  'Existe el límite de imágenes en base'
);
select has_trigger(
  'public',
  'beneficiaries',
  'beneficiaries_validate_status',
  'Existe la validación de publicación en base'
);
select isnt_empty(
  $$select 1 from storage.buckets where id = 'beneficiary-media' and public = false$$,
  'El bucket de fotografías es privado'
);

select * from finish();
rollback;
