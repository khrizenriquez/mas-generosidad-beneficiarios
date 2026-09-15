begin;

select plan(8);

select has_table('public', 'beneficiaries', 'Existe beneficiaries');
select has_table('public', 'beneficiary_images', 'Existe beneficiary_images');
select has_table('public', 'admin_users', 'Existe admin_users');
select policies_are(
  'public',
  'beneficiaries',
  array['admins create beneficiaries', 'admins read beneficiaries', 'admins update beneficiaries'],
  'Beneficiaries no expone una política pública ni borrado'
);
select isnt_empty(
  $$select 1 from pg_proc where proname = 'get_public_beneficiaries'$$,
  'Existe la proyección pública segura'
);
select is_empty(
  $$select 1 from information_schema.routine_columns where specific_name like 'get_public_beneficiaries%' and column_name = 'date_of_birth'$$,
  'La fecha de nacimiento no forma parte del contrato público'
);
select isnt_empty(
  $$select 1 from pg_trigger where tgname = 'beneficiary_images_limit'$$,
  'Existe el límite de imágenes en base'
);
select isnt_empty(
  $$select 1 from storage.buckets where id = 'beneficiary-media' and public = false$$,
  'El bucket es privado'
);

select * from finish();
rollback;
