begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(4);

select lives_ok(
  $$insert into public.beneficiaries (code, gender) values ('MG-921', 'Niño')$$,
  'La base acepta Niño'
);

select lives_ok(
  $$insert into public.beneficiaries (code, gender) values ('MG-922', 'Niña')$$,
  'La base acepta Niña'
);

select lives_ok(
  $$insert into public.beneficiaries (code, gender) values ('MG-923', null)$$,
  'La base acepta género sin especificar como nulo'
);

select throws_ok(
  $$insert into public.beneficiaries (code, gender) values ('MG-924', 'Otro')$$,
  '23514',
  null,
  'La base rechaza cualquier género no permitido'
);

select * from finish();
rollback;
