begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(11);

insert into public.beneficiaries (id, code, full_name, date_of_birth, status)
values
  ('95000000-0000-4000-8000-000000000001', 'MG-951', 'Perfil bilingüe ficticio', '2015-01-01', 'draft'),
  ('95000000-0000-4000-8000-000000000002', 'MG-952', 'Perfil parcial ficticio', '2015-01-01', 'draft'),
  ('95000000-0000-4000-8000-000000000003', 'MG-953', 'Perfil español ficticio', '2015-01-01', 'draft');

insert into public.beneficiary_localizations (
  beneficiary_id, locale, school_grade, favorite_subject, hobby, future_goal, public_story
)
values
  ('95000000-0000-4000-8000-000000000001', 'es', 'Grado ficticio', 'Materia ficticia', 'Actividad ficticia', 'Meta ficticia', 'Relato ficticio en español.'),
  ('95000000-0000-4000-8000-000000000001', 'en', 'Fictional grade', 'Fictional subject', 'Fictional hobby', 'Fictional goal', 'Fictional story in English.'),
  ('95000000-0000-4000-8000-000000000002', 'es', 'Grado ficticio', 'Materia ficticia', 'Actividad ficticia', 'Meta ficticia', 'Relato ficticio en español.'),
  ('95000000-0000-4000-8000-000000000002', 'en', 'Fictional grade', null, null, null, null),
  ('95000000-0000-4000-8000-000000000003', 'es', 'Grado ficticio', 'Materia ficticia', 'Actividad ficticia', 'Meta ficticia', 'Relato ficticio en español.');

select lives_ok(
  $$update public.beneficiaries set status = 'published' where code = 'MG-951'$$,
  'Una historia con ambas versiones completas puede publicarse'
);

select results_eq(
  $$select localizations -> 'en' ->> 'public_story' from public.get_public_beneficiary('MG-951')$$,
  $$values ('Fictional story in English.'::text)$$,
  'La RPC incluye el relato inglés completo'
);

select results_eq(
  $$select localizations -> 'es' ->> 'public_story' from public.get_public_beneficiary('MG-951')$$,
  $$values ('Relato ficticio en español.'::text)$$,
  'La RPC conserva el relato español completo'
);

select throws_ok(
  $$update public.beneficiaries set status = 'published' where code = 'MG-952'$$,
  'P0001',
  null,
  'Una traducción inglesa parcial impide la publicación inicial'
);

select lives_ok(
  $$update public.beneficiaries set status = 'published' where code = 'MG-953'$$,
  'Una historia con solo español puede publicarse'
);

select is(
  (select localizations ? 'en' from public.get_public_beneficiary('MG-953')),
  false,
  'La ausencia de inglés se expresa sin fallback editorial'
);

insert into public.beneficiary_localizations (
  beneficiary_id, locale, school_grade
)
values ('95000000-0000-4000-8000-000000000003', 'en', 'Fictional grade');

select lives_ok(
  $$update public.beneficiary_localizations set hobby = 'A partial translation' where beneficiary_id = '95000000-0000-4000-8000-000000000003' and locale = 'en'$$,
  'Una historia publicada puede recibir una traducción inglesa en progreso'
);

select is(
  (select localizations ? 'en' from public.get_public_beneficiary('MG-953')),
  false,
  'Una traducción inglesa en progreso no se expone públicamente'
);

select lives_ok(
  $$insert into public.beneficiary_images (id, beneficiary_id, thumbnail_path, detail_path, sort_order, is_primary)
    values ('96000000-0000-4000-8000-000000000001', '95000000-0000-4000-8000-000000000001', 'contract/i18n-thumbnail.webp', 'contract/i18n-detail.webp', 0, true)$$,
  'Se puede agregar una fotografía compartida'
);

insert into public.beneficiary_image_localizations (image_id, locale, alt_text)
values
  ('96000000-0000-4000-8000-000000000001', 'es', 'Imagen ficticia en español'),
  ('96000000-0000-4000-8000-000000000001', 'en', 'Fictional image in English');

select results_eq(
  $$select images #>> '{0,alt_texts,en}' from public.get_public_beneficiary('MG-951')$$,
  $$values ('Fictional image in English'::text)$$,
  'La RPC devuelve texto alternativo por idioma'
);

set local role anon;

select throws_ok(
  $$select * from public.beneficiary_image_localizations$$,
  '42501',
  null,
  'Anon no puede leer localizaciones de fotografía'
);

reset role;

select * from finish();
rollback;
